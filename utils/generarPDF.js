const { format } = require('date-fns'); // Importar la función de formato
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

  // Formatear la fecha (día, mes, año)
  const fechaFormateada = format(new Date(factura.fecha), 'dd/MM/yyyy');

  // Encabezado
  doc.fontSize(20).text("MARKET WAWA", { align: "center" });
  doc.fontSize(20).text("FACTURA", { align: "center" });
  doc.moveDown();

  // Información de la factura
  doc.fontSize(14).text(`Factura ID: ${factura.id_factura}`);
  doc.text(`Cliente: ${factura.nombre} ${factura.apellido}`);
  doc.text(`Fecha: ${fechaFormateada}`);
  doc.moveDown();

  // Detalles de productos (Tabla)
  doc.text("Detalles de la Factura", { underline: true });
  doc.moveDown();

  // Configurar la tabla
  const columnWidth = { cantidad: 80, producto: 200, precio: 100 };
  doc.fontSize(12);
  
  // Cabecera de la tabla
  doc.text("Cantidad", 50, doc.y, { width: columnWidth.cantidad, align: "center", bold: true });
  doc.text("Producto", 50 + columnWidth.cantidad, doc.y, { width: columnWidth.producto, align: "center", bold: true });
  doc.text("Precio", 50 + columnWidth.cantidad + columnWidth.producto, doc.y, { width: columnWidth.precio, align: "center", bold: true });
  doc.moveDown(1);

  // Dibujar las líneas de separación
  doc.moveTo(50, doc.y).lineTo(50 + columnWidth.cantidad + columnWidth.producto + columnWidth.precio, doc.y).stroke();
  doc.moveDown(1);

  // Dibujar las filas de la tabla
  factura.detalles.forEach((item) => {
    const precio = parseFloat(item.precio_unitario);
    const cantidad = item.cantidad;
    const totalPorProducto = (precio * cantidad).toFixed(2);

    doc.text(cantidad.toString(), 50, doc.y, { width: columnWidth.cantidad, align: "center" });
    doc.text(item.producto, 50 + columnWidth.cantidad, doc.y, { width: columnWidth.producto, align: "left" });
    if (!isNaN(precio)) {
      doc.text(`$${totalPorProducto}`, 50 + columnWidth.cantidad + columnWidth.producto, doc.y, { width: columnWidth.precio, align: "right" });
    } else {
      doc.text("No disponible", 50 + columnWidth.cantidad + columnWidth.producto, doc.y, { width: columnWidth.precio, align: "right" });
    }
    doc.moveDown(1);
  });

  // Dibujar la línea final de la tabla
  doc.moveTo(50, doc.y).lineTo(50 + columnWidth.cantidad + columnWidth.producto + columnWidth.precio, doc.y).stroke();
  doc.moveDown(1);

  // Total debajo de la columna de precio
  const total = parseFloat(factura.total);
  if (!isNaN(total)) {
    doc.text("Total:", 50 + columnWidth.cantidad + columnWidth.producto, doc.y, { width: columnWidth.precio, align: "right", bold: true });
    doc.text(`$${total.toFixed(2)}`, 50 + columnWidth.cantidad + columnWidth.producto + columnWidth.precio, doc.y, { width: columnWidth.precio, align: "right", bold: true });
  } else {
    doc.text("Total: No disponible", 50 + columnWidth.cantidad + columnWidth.producto, doc.y, { width: columnWidth.precio, align: "right", bold: true });
  }

  doc.end();

  stream.on("finish", () => {
    callback(rutaArchivo);
  });
}

module.exports = generarPDF;
