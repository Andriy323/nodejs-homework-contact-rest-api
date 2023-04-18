const express = require("express");
const validateBody = require("../../utils/validateBody");
const ctrl = require("../../models/autch");
const loginValidation = require("../../utils/validation/loginValidation")
const registerValidation = require("../../utils/validation/registerValidation")
const router = express.Router();
const { aunthenticate } = require("../../midlewares");

router.post(
  "/register",
  validateBody(registerValidation),
  ctrl.register
);
module.exports = router;

router.post("/login", validateBody(loginValidation), ctrl.login);

router.get("/current", aunthenticate, ctrl.current);

router.post("/logout", aunthenticate, ctrl.logout);
