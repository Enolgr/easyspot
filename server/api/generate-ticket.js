// server/api/generate-ticket.js
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';

export default defineEventHandler(async (event) => {
  // Se espera recibir desde el cliente el sessionId y el email del comprador.
  const body = await readBody(event);
  const { sessionId, email } = body;

  // Aquí deberías obtener los datos reales del ticket (por ejemplo, consultando tu base de datos)
  // Para este ejemplo, se simulan los datos:
  const ticketDetails = {
    eventTitle: 'Concierto de Rock',
    eventDate: '2025-04-30 20:00',
    venue: 'Sala Principal',
    ticketId: 'TICKET12345'
  };

  // Generar el código QR a partir del ticketId (o cualquier dato que te sirva para identificar la entrada)
  const qrData = ticketDetails.ticketId;
  const qrImageDataUrl = await QRCode.toDataURL(qrData);

  // Crear el documento PDF con PDFKit
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const buffers = [];
  doc.on('data', (chunk) => buffers.push(chunk));

  // Agregar título del evento, fecha, sala y el código QR al PDF
  doc.fontSize(22).text(ticketDetails.eventTitle, { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Fecha y Hora: ${ticketDetails.eventDate}`, { align: 'center' });
  doc.text(`Lugar: ${ticketDetails.venue}`, { align: 'center' });
  doc.moveDown();

  // Convertir la imagen QR (dataURL) a buffer
  const base64Data = qrImageDataUrl.split(',')[1];
  const qrBuffer = Buffer.from(base64Data, 'base64');
  // Insertar la imagen del QR en el PDF
  doc.image(qrBuffer, { fit: [150, 150], align: 'center' });
  
  doc.moveDown();
  doc.fontSize(12).text(`Ticket ID: ${ticketDetails.ticketId}`, { align: 'center' });
  doc.end();

  // Esperar a que el PDF se complete y obtener el buffer final
  const pdfBuffer = await new Promise((resolve, reject) => {
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  // Configurar el transporte de correo (SMTP)
  const transporter = nodemailer.createTransport({
    host: 'smtp.tudominio.com', // Cambia por el host de tu servidor SMTP
    port: 587,
    secure: false,
    auth: {
      user: 'tu_email@tudominio.com',
      pass: 'tu_password'
    }
  });

  // Configurar el correo con el PDF adjunto
  const mailOptions = {
    from: '"Eventos" <tu_email@tudominio.com>',
    to: email,
    subject: 'Tu entrada para el evento',
    text: 'Adjunto encontrarás tu entrada en formato PDF con el código QR.',
    attachments: [
      {
        filename: 'entrada.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    return { message: 'Ticket enviado correctamente.' };
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Error al enviar el ticket: ' + error.message });
  }
});
