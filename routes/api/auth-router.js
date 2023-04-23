const express = require("express");
const validateBody = require("../../utils/validateBody");
const ctrl = require("../../models/autch");
const { loginValidation } = require("../../utils/validation/loginValidation");
const {
  registerValidation,
} = require("../../utils/validation/registerValidation");
const router = express.Router();
const { aunthenticate } = require("../../midlewares");
const upload = require("../../midlewares/upload");

router.post("/register", validateBody(registerValidation), ctrl.register);
module.exports = router;

router.post("/login", validateBody(loginValidation), ctrl.login);

router.get("/current", aunthenticate, ctrl.current);

router.post("/logout", aunthenticate, ctrl.logout);

router.patch(
  "/users/avatars",
  aunthenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);
