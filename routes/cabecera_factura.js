const express = require("express");
const router = express.Router();
const pool = require("../db"); // Conexión a PostgreSQL

// Obtener todas las facturas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cabecera_factura");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una factura por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM cabecera_factura WHERE id_factura = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una nueva factura
router.post("/", async (req, res) => {
  try {
    const { id_cliente, id_usuario, total } = req.body;
    const result = await pool.query(
      `INSERT INTO cabecera_factura (id_cliente, id_usuario, total) 
             VALUES ($1, $2, $3) RETURNING *`,
      [id_cliente, id_usuario, total]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una factura por ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { id_cliente, id_usuario, total } = req.body;

    const result = await pool.query(
      `UPDATE cabecera_factura 
             SET id_cliente = $1, id_usuario = $2, total = $3
             WHERE id_factura = $4 RETURNING *`,
      [id_cliente, id_usuario, total, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una factura por ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM cabecera_factura WHERE id_factura = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    res.json({ message: "Factura eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
