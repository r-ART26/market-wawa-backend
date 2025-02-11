const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'email@gmail.com',  // Tu dirección de correo de Gmail
    pass: 'flqp adadad ckub muoa',  // La contraseña de aplicación generada, con espacios incluidos
  },
  port: 587, // Usa el puerto 587 para STARTTLS
  secure: false, // Para el puerto 587, "secure" debe ser falso
  tls: {
    rejectUnauthorized: false, // Desactiva la validación de certificado SSL
  }
});

module.exports = transporter;
