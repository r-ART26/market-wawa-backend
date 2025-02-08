require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Importar rutas
const rolesRoutes = require("./routes/roles");
const proveedoresRoutes = require("./routes/proveedores");
const personasRoutes = require("./routes/personas");
const productosRoutes = require("./routes/productos");
const cabeceraFacturaRoutes = require("./routes/cabecera_factura");
const detalleFacturaRoutes = require("./routes/detalle_factura");

app.use("/api/roles", rolesRoutes);
app.use("/api/proveedores", proveedoresRoutes);
app.use("/api/personas", personasRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/cabecera_factura", cabeceraFacturaRoutes);
app.use("/api/detalle_factura", detalleFacturaRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
