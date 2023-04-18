const Joi = require("joi");
const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../utils/handleMongooseError");
// const Error = require('../utils/handleMongooseError')

const emailRegexpi =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const shemaUser = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: emailRegexpi,
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: String,
});

shemaUser.post("save", handleMongooseError);

const User = model("user", shemaUser);

const shemaLogin = Joi.object({
  email: Joi.string().pattern(emailRegexpi).required(),
  password: Joi.string().min(6).required(),
});

const shemaRegister = Joi.object({
  email: Joi.string().pattern(emailRegexpi).required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().required(),
});

const autchShemas = {
  shemaUser,
  shemaRegister,
  shemaLogin,
};

module.exports = {
  User,
  autchShemas,
};
