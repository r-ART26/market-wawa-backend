const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,  
  },
  port: 587, // Usa el puerto 587 para STARTTLS
  secure: false, 
  tls: {
    rejectUnauthorized: false, // Desactiva la validación de certificado SSL
  }
});

module.exports = transporter;
