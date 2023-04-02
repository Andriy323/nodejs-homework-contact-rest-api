const express = require("express");
const contacts = require("../../models/contacts");
const router = express.Router();
const Joi = require("joi");
const HttpError = require("../../helpers/HttpError");

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
});

router.get("/", async (req, res, next) => {
  try {
    const result = await contacts.getContacts();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    console.log(req.params);
    const result = await contacts.getContactById(contactId);
    if (!result) {
      throw HttpError(404, `There is no contact with such an id: ${contactId}`);
    }
    res.json(result);
  } catch (error) {
    const { status = 500, message = "Server log" } = error;
    res.status(status).json({
      message,
    });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addShema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    console.log(contactId);
    const result = await contacts.removeContact(contactId);
    console.log(result);
    if (!result) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({
      message: "Contact deleted",
    });
  } catch (error) {}
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = addShema.validate(req.body);
    if (error) {
      throw HttpError(400, "missing fields");
    }

    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
