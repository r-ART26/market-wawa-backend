const express = require("express");
const router = express.Router();
const pool = require("../db"); // Conexión a PostgreSQL
const generarPDF = require("../utils/generarPDF");
const fs = require("fs");
const transporter = require("../correo/emailConfig");


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

// Nuevo endpoint para crear la factura y sus detalles en un solo paso
router.post("/crear-completa", async (req, res) => {
  try {
    const { id_cliente, id_usuario, total, detallesFactura, email } = req.body;

    // Verificar si el correo está presente
    if (!email) {
      return res.status(400).json({ error: "El campo 'email' es obligatorio" });
    }

    console.log("Email recibido:", email); // Verifica que el email esté presente

    // 1. Crear la cabecera de la factura
    const facturaResult = await pool.query(
      `INSERT INTO cabecera_factura (id_cliente, id_usuario, total)
      VALUES ($1, $2, $3) RETURNING *`,
      [id_cliente, id_usuario, total]
    );

    const id_factura = facturaResult.rows[0].id_factura;

    // 2. Crear los detalles de la factura (productos)
    const detallesPromises = detallesFactura.map((detalle) =>
      pool.query(
        `INSERT INTO detalle_factura (id_factura, id_producto, cantidad, precio_unitario, subtotal)
        VALUES ($1, $2, $3, $4, $5)`,
        [
          id_factura,
          detalle.id_producto,
          detalle.cantidad,
          detalle.precio_unitario,
          detalle.subtotal
        ]
      )
    );

    await Promise.all(detallesPromises);

    // 3. Obtener la factura completa y los detalles para generar el PDF
    const { rows } = await pool.query(`SELECT f.id_factura, c.nombre, c.apellido, f.fecha, f.total
                                       FROM cabecera_factura f
                                       JOIN clientes c ON f.id_cliente = c.id_cliente
                                       WHERE f.id_factura = $1`, [id_factura]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }

    const factura = rows[0];
    const { rows: detalles } = await pool.query(`
      SELECT p.nombre AS producto, d.cantidad, d.precio_unitario
      FROM detalle_factura d
      JOIN productos p ON d.id_producto = p.id_producto
      WHERE d.id_factura = $1
    `, [id_factura]);

    factura.detalles = detalles;

    // Generar el PDF
    generarPDF(factura, (rutaPDF) => {
      console.log("Ruta del PDF generado:", rutaPDF); // Verifica que la ruta del PDF es correcta

      // Configurar el correo
      const mailOptions = {
        from: process.env.EMAIL_USER,  // Asegúrate de que esté configurado correctamente en el .env
        to: `${email}, robertortups@gmail.com`, // El correo al que se debe enviar la factura
        subject: `Factura #${factura.id_factura}`,
        text: "Adjunto encontrarás la factura en PDF.",
        attachments: [{ filename: `factura_${factura.id_factura}.pdf`, path: rutaPDF }],
      };

      // Enviar el correo
      transporter.sendMail(mailOptions, (error, info) => {
        // Eliminar el PDF después de enviarlo
        fs.unlinkSync(rutaPDF);

        if (error) {
          console.error("Error al enviar el correo:", error);
          return res.status(500).json({ error: "Error al enviar el correo" });
        }

        console.log("Correo enviado con éxito:", info); // Verifica que el correo se envió correctamente
        res.json({ mensaje: "Factura y correo enviados correctamente", info });
      });
    });

  } catch (error) {
    console.error("Error al crear factura y detalles:", error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
