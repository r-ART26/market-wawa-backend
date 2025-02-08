require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Importar rutas
const proveedoresRoutes = require("./routes/proveedores");
const usuariosRoutes = require("./routes/usuarios");
const productosRoutes = require("./routes/productos");
const detalleFacturaRoutes = require("./routes/detalle_factura");
const clientesRoutes = require("./routes/clientes");
const facturasRoutes = require("./routes/cabecera_factura");

app.use("/api/proveedores", proveedoresRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/detalle_factura", detalleFacturaRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/facturas", facturasRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
