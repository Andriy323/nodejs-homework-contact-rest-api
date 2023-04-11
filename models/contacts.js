const ctrlWrapper = require("../utils/ctrlWrapper");
const HttpError = require("../helpers/HttpError");
const shema = require("../shema/shema");

const gettContacts = async (req, res) => {
  const result = await shema.Contact.find();
  res.json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await shema.Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, `Contact with ${contactId} not found`);
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const result = await shema.Contact.create(req.body);
  res.status(201).json(result);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await shema.Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpError(404, `Contact with ${contactId} not found`);
  }
  res.json({
    message: `Delete contact with id: ${contactId}`,
  });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await shema.Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Contact with ${contactId} not found`);
  }
  res.json(result);
};
const updateContactFavorite = async (req, res) => {
  const { contactId } = req.params;
  const result = await shema.Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Contact with ${contactId} not found`);
  }
  res.json(result);
};
module.exports = {
  gettContacts: ctrlWrapper(gettContacts),
  getContactById: ctrlWrapper(getContactById),
  removeContact: ctrlWrapper(removeContact),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  updateContactFavorite: ctrlWrapper(updateContactFavorite),
};
