const nodemailer = require("nodemailer");

/**
 * This is a function that sends an email using nodemailer package in JavaScript.
 * @param options - An object containing the email options such as email address, subject, message, and
 * html.
 */
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
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
