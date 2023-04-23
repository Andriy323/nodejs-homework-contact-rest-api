const express = require("express");
const router = express.Router();
const ctrl = require("../../models/contacts");
const validateBody = require("../../utils/validateBody");
const shemas = require("../../utils/validation/contactValidationSchemas");

const { validId, aunthenticate } = require("../../midlewares");

router.get("/", aunthenticate, ctrl.gettContacts);
router.post("/", aunthenticate, validateBody(shemas.addShema), ctrl.addContact);
router.get("/:contactId", aunthenticate, validId, ctrl.getContactById);
router.put(
  "/:contactId",
  aunthenticate,
  validateBody(shemas.addShema),
  ctrl.updateContact
);
router.patch(
  "/:contactId/favorite",
  aunthenticate,
  validateBody(shemas.updateFavorite),
  ctrl.updateContactFavorite
);
router.delete("/:contactId", aunthenticate, ctrl.removeContact);

module.exports = router;
