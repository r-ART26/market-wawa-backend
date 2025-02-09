const express = require("express");
const router = express.Router();
const pool = require("../db"); // Conexión a PostgreSQL

// Obtener todos los clientes
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clientes");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un cliente por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM clientes WHERE id_cliente = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/cedula/:cedula", async (req, res) => {
  try {
    const { cedula } = req.params;
    const result = await pool.query(
      "SELECT * FROM clientes WHERE cedula = $1",
      [cedula]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo cliente
router.post("/", async (req, res) => {
  try {
    const { cedula, nombre, apellido, direccion, telefono, email } = req.body;
    const result = await pool.query(
      `INSERT INTO clientes (cedula, nombre, apellido, direccion, telefono, email) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [cedula, nombre, apellido, direccion, telefono, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un cliente por ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { cedula, nombre, apellido, direccion, telefono, email } = req.body;

    const result = await pool.query(
      `UPDATE clientes 
             SET cedula = $1, nombre = $2, apellido = $3, direccion = $4, telefono = $5, email = $6
             WHERE id_cliente = $7 RETURNING *`,
      [cedula, nombre, apellido, direccion, telefono, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un cliente por ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM clientes WHERE id_cliente = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
