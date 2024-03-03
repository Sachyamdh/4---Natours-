const mailer = require("nodemailer");

const sendMail = async (options) => {
  // creating a transporter
  const transporter = mailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //Activate in gmail "less secure app" options
  // defining the email options
  const mailOptions = {
    from: "Sachyam Dhungana <dhunganasachyam@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //sending the mail with nodemailer

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
