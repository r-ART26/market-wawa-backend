const express = require("express");
const router = express.Router();
const pool = require("../db"); // Asegúrate de tener configurada la conexión a PostgreSQL

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE id_usuario = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo usuario
router.post("/", async (req, res) => {
  try {
    const {
      cedula,
      nombre,
      apellido,
      telefono,
      nombre_usuario,
      contraseña,
      rol,
    } = req.body;
    const result = await pool.query(
      `INSERT INTO usuarios (cedula, nombre, apellido, telefono, nombre_usuario, contraseña, rol) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [cedula, nombre, apellido, telefono, nombre_usuario, contraseña, rol]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un usuario por ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      cedula,
      nombre,
      apellido,
      telefono,
      nombre_usuario,
      contraseña,
      rol,
    } = req.body;

    const result = await pool.query(
      `UPDATE usuarios 
             SET cedula = $1, nombre = $2, apellido = $3, telefono = $4, nombre_usuario = $5, contraseña = $6, rol = $7
             WHERE id_usuario = $8 RETURNING *`,
      [cedula, nombre, apellido, telefono, nombre_usuario, contraseña, rol, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un usuario por ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
