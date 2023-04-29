const express = require("express");
const validateBody = require("../../utils/validateBody");
const ctrl = require("../../models/autch");
const {emailShema} = require("../../utils/validation/emailShema")
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

router.get("/users/verify/:verificationToken", ctrl.verify)
router.post("/users/verify" , validateBody(emailShema), ctrl.resendEmailVerify)