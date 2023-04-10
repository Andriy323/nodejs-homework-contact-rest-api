const Joi = require("joi");

const addShema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `"name" is required`,
  }),
  email: Joi.string().required().messages({
    "any.required": `"email" is required`,
  }),
  phone: Joi.string().required().messages({
    "any.required": `"phone" is required`,
  }),
  favorite: Joi.boolean(),
});

const updateFavorite = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  addShema,
  updateFavorite,
};
