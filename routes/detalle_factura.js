const express = require("express");
const pool = require("../db");
const router = express.Router();

// Obtener todos los detalles de factura
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM detalle_factura");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un detalle de factura por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM detalle_factura WHERE id_detalle = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Detalle de factura no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear un nuevo detalle de factura
router.post("/", async (req, res) => {
  try {
    const { id_factura, id_producto, cantidad, precio_unitario, subtotal } =
      req.body;
    const result = await pool.query(
      "INSERT INTO detalle_factura (id_factura, id_producto, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id_factura, id_producto, cantidad, precio_unitario, subtotal]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un detalle de factura
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { id_factura, id_producto, cantidad, precio_unitario, subtotal } =
      req.body;
    const result = await pool.query(
      "UPDATE detalle_factura SET id_factura = $1, id_producto = $2, cantidad = $3, precio_unitario = $4, subtotal = $5 WHERE id_detalle = $6 RETURNING *",
      [id_factura, id_producto, cantidad, precio_unitario, subtotal, id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Detalle de factura no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un detalle de factura
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM detalle_factura WHERE id_detalle = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Detalle de factura no encontrado" });
    }
    res.json({ message: "Detalle de factura eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
