const { HttpError } = require("../helpers/HttpError");

const { isValidObjectId } = require("mongoose");

const validId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
   return next(HttpError(404, `${contactId} invalid format`));
  }
  next();
};
module.exports = validId;
