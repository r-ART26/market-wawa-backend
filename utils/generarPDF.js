const PDFDocument = require("pdfkit");
const fs = require("fs");

function generarPDF(factura, callback) {
  const doc = new PDFDocument();
  const nombreArchivo = `factura_${factura.id_factura}.pdf`;
  const rutaArchivo = `./facturas/${nombreArchivo}`;

  // Crear directorio si no existe
  if (!fs.existsSync("./facturas")) {
    fs.mkdirSync("./facturas");
  }

  const stream = fs.createWriteStream(rutaArchivo);
  doc.pipe(stream);

  // Encabezado
  doc.fontSize(20).text("MARKET WAWA", { align: "center" });
  doc.fontSize(20).text("FACTURA", { align: "center" });
  doc.moveDown();

  // Información de la factura
  doc.fontSize(14).text(`Factura ID: ${factura.id_factura}`);
  doc.text(`Cliente: ${factura.nombre} ${factura.apellido}`);
  doc.text(`Fecha: ${factura.fecha}`);
  doc.moveDown();

  // Detalles de productos
  doc.text("Detalles:", { underline: true });
  factura.detalles.forEach((item) => {
    doc.text(`${item.producto} - Cantidad: ${item.cantidad} - Precio: $${item.precio_unitario}`);
  });

  doc.moveDown();
  doc.text(`Total: $${factura.total}`, { bold: true });

  doc.end();

  stream.on("finish", () => {
    callback(rutaArchivo);
  });
}

module.exports = generarPDF;
