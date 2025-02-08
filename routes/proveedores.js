const express = require("express");
const pool = require("../db");
const router = express.Router();

// Obtener todos los proveedores
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM proveedores");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un proveedor por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM proveedores WHERE id_proveedor = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear un nuevo proveedor
router.post("/", async (req, res) => {
  try {
    const { nombre, direccion, telefono, email } = req.body;
    const result = await pool.query(
      "INSERT INTO proveedores (nombre, direccion, telefono, email) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, direccion, telefono, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un proveedor
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, direccion, telefono, email } = req.body;
    const result = await pool.query(
      "UPDATE proveedores SET nombre = $1, direccion = $2, telefono = $3, email = $4 WHERE id_proveedor = $5 RETURNING *",
      [nombre, direccion, telefono, email, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un proveedor
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM proveedores WHERE id_proveedor = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }
    res.json({ message: "Proveedor eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
