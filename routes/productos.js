const express = require("express");
const pool = require("../db");
const router = express.Router();

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM productos WHERE id_producto = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear un nuevo producto
router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      stock,
      id_proveedor,
    } = req.body;
    const result = await pool.query(
      "INSERT INTO productos (nombre, descripcion, precio_compra, precio_venta, stock, id_proveedor) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [nombre, descripcion, precio_compra, precio_venta, stock, id_proveedor]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un producto
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      stock,
      id_proveedor,
    } = req.body;
    const result = await pool.query(
      "UPDATE productos SET nombre = $1, descripcion = $2, precio_compra = $3, precio_venta = $4, stock = $5, id_proveedor = $6 WHERE id_producto = $7 RETURNING *",
      [
        nombre,
        descripcion,
        precio_compra,
        precio_venta,
        stock,
        id_proveedor,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un producto
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM productos WHERE id_producto = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
