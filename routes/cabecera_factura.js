const express = require("express");
const pool = require("../db");
const router = express.Router();

// Obtener todas las facturas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cabecera_factura");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear una nueva factura
router.post("/", async (req, res) => {
  try {
    const { id_persona, total } = req.body;
    const result = await pool.query(
      "INSERT INTO cabecera_factura (id_persona, total) VALUES ($1, $2) RETURNING *",
      [id_persona, total]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar una factura
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { id_persona, total } = req.body;
    const result = await pool.query(
      "UPDATE cabecera_factura SET id_persona = $1, total = $2 WHERE id_factura = $3 RETURNING *",
      [id_persona, total, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar una factura
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
