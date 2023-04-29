const express = require("express");
const logger = require("morgan");
const cors = require("cors");
// const nodemailer = require('nodemailer');

require("dotenv").config();
const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/auth-router");
 const app = express();




// const config = {
//   host: 'smtp.meta.ua',
//   port: 465,
//   secure: true,
//   auth: {
//     user: 'andriy3223@meta.ua',
//     pass: process.env.META_PASSWORD,
//   },
// };

// const transporter = nodemailer.createTransport(config);
// const emailOptions = {
//   from: 'andriy3223@meta.ua',
//   to: 'dorima5541@larland.com',
//   subject: 'Nodemailer test',
//   text: 'Привіт. Ми тестуємо надсилання листів!',
// };

// transporter
//   .sendMail(emailOptions)
//   .then(info => console.log(info))
//   .catch(err => console.log(err));




const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/autch", authRouter);

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
