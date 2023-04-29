const nodemailer = require("nodemailer");

require("dotenv").config();

const { EMAIL_FROM, META_PASSWORD } = process.env;

const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_FROM,
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async (data) => {
  const email = { ...data, from: EMAIL_FROM };
  await transporter.sendMail(email);
  return true;
};

// transporter
//   .sendMail(emailOptions)
//   .then(info => console.log(info))
//   .catch(err => console.log(err));

module.exports = sendEmail;
