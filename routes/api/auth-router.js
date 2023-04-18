const express = require("express");
const validateBody = require("../../utils/validateBody");
const ctrl = require("../../models/autch");
const { autchShemas } = require("../../shema/shema-user");
const router = express.Router();
const { aunthenticate } = require("../../midlewares");

router.post(
  "/register",
  validateBody(autchShemas.shemaRegister),
  ctrl.register
);
module.exports = router;

router.post("/login", validateBody(autchShemas.shemaLogin), ctrl.login);

router.get("/current", aunthenticate, ctrl.current);

router.post("/logout", aunthenticate, ctrl.logout);
