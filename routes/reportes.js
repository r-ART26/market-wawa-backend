const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/ventas-por-periodo/:periodo", async (req, res) => {
  try {
    const { periodo } = req.params;
    let groupBy = "";

    switch (periodo) {
      case "diario":
        groupBy = "DATE(fecha)";
        break;
      case "semanal":
        groupBy = "DATE_TRUNC('week', fecha)";
        break;
      case "mensual":
        groupBy = "DATE_TRUNC('month', fecha)";
        break;
      case "anual":
        groupBy = "DATE_TRUNC('year', fecha)";
        break;
      default:
        return res.status(400).json({ error: "Período no válido" });
    }

    const result = await pool.query(`
      SELECT ${groupBy} AS periodo, SUM(total) AS total_ventas
      FROM cabecera_factura
      GROUP BY ${groupBy}
      ORDER BY periodo DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/ventas-por-cliente/:id_cliente", async (req, res) => {
  try {
    const { id_cliente } = req.params;
    const result = await pool.query(
      `
      SELECT cf.id_factura, cf.fecha, cf.total, 
             ARRAY_AGG(p.nombre || ' (x' || df.cantidad || ')') AS productos
      FROM cabecera_factura cf
      JOIN detalle_factura df ON cf.id_factura = df.id_factura
      JOIN productos p ON df.id_producto = p.id_producto
      WHERE cf.id_cliente = $1
      GROUP BY cf.id_factura
      ORDER BY cf.fecha DESC
    `,
      [id_cliente]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/productos-mas-vendidos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.nombre, SUM(df.cantidad) AS total_vendido
      FROM detalle_factura df
      JOIN productos p ON df.id_producto = p.id_producto
      GROUP BY p.nombre
      ORDER BY total_vendido DESC
      LIMIT 10
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/ingresos-por-periodo/:periodo", async (req, res) => {
  try {
    const { periodo } = req.params;
    let groupBy = "";

    switch (periodo) {
      case "diario":
        groupBy = "DATE(fecha)";
        break;
      case "semanal":
        groupBy = "DATE_TRUNC('week', fecha)";
        break;
      case "mensual":
        groupBy = "DATE_TRUNC('month', fecha)";
        break;
      case "anual":
        groupBy = "DATE_TRUNC('year', fecha)";
        break;
      default:
        return res.status(400).json({ error: "Período no válido" });
    }

    const result = await pool.query(`
      SELECT ${groupBy} AS periodo, SUM(total) AS ingresos_totales
      FROM cabecera_factura
      GROUP BY ${groupBy}
      ORDER BY periodo DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/stock-productos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id_producto, nombre, stock
      FROM productos
      ORDER BY stock ASC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/compras-a-proveedores", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT pr.nombre AS proveedor, SUM(p.precio_compra * df.cantidad) AS total_compras
      FROM productos p
      JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
      JOIN detalle_factura df ON p.id_producto = df.id_producto
      GROUP BY pr.nombre
      ORDER BY total_compras DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
