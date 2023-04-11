const express = require("express");

const ctrl = require("../../models/contacts");
const router = express.Router();
const validateBody = require("../../utils/validateBody");
const shemas = require("../../utils/validation/contactValidationSchemas");
router.get("/", ctrl.gettContacts);
router.post("/", validateBody(shemas.addShema), ctrl.addContact);
router.get("/:contactId", ctrl.getContactById);
router.put("/:contactId", validateBody(shemas.addShema), ctrl.updateContact);
router.patch(
  "/:contactId/favorite",
  validateBody(shemas.updateFavorite),
  ctrl.updateContactFavorite
);
router.delete("/:contactId", ctrl.removeContact);

module.exports = router;
