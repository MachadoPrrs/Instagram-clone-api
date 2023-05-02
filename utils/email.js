const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
  });

  // email options
  const mailOptions = {
    from: "Cesar M.",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
