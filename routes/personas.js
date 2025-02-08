const express = require("express");
const pool = require("../db");
const router = express.Router();

// Obtener todas las personas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM personas");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener una persona por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM personas WHERE id_persona = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Persona no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear una nueva persona
router.post("/", async (req, res) => {
  try {
    const { nombre, apellido, direccion, telefono, email, id_rol } = req.body;
    const result = await pool.query(
      "INSERT INTO personas (nombre, apellido, direccion, telefono, email, id_rol) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [nombre, apellido, direccion, telefono, email, id_rol]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar una persona
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, direccion, telefono, email, id_rol } = req.body;
    const result = await pool.query(
      "UPDATE personas SET nombre = $1, apellido = $2, direccion = $3, telefono = $4, email = $5, id_rol = $6 WHERE id_persona = $7 RETURNING *",
      [nombre, apellido, direccion, telefono, email, id_rol, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Persona no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar una persona
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM personas WHERE id_persona = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Persona no encontrada" });
    }
    res.json({ message: "Persona eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
