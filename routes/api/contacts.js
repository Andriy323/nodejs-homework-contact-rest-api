const express = require("express");

const ctrl = require("../../models/contacts");
const router = express.Router();
const { shemas } = require("../../shema/shema");
const validateBody = require("../../utils/validateBody");
router.get("/", ctrl.listContacts);
router.post("/", validateBody(shemas.addShema), ctrl.addContact);
router.get("/:contactId", ctrl.getContactById);
router.put("/:contactId", validateBody(shemas.addShema), ctrl.updateContact);
router.patch("/:contactId/favorite", validateBody(shemas.updateFavorite), ctrl.updateContactFavorite)
router.delete('/:contactId', ctrl.removeContact)


module.exports = router;
