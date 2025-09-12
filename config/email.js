const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // 1) Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EEMAIL_USERNAME,   
        pass: process.env.EMAIL_PASSWORD 
      }
    });

    // 2) Define email options
    const mailOptions = {
      from: 'Question Bank <gemedatam@gmail.com>', // sender name + email
      to: options.email,                           // recipient
      subject: options.subject,                    // email subject
      text: options.message,                       // plain text
      html: options.html || ''                     // optional HTML
    };

    // 3) Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

module.exports = sendEmail;
