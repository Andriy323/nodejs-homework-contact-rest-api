const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
const gravatar = require("gravatar");
const ctrlWrapper = require("../utils/ctrlWrapper");
const { HttpError } = require("../helpers");

const { User } = require("../shema/shema-user");
const { SECRET_KEY } = process.env;

const dirAvatar = path.join(__dirname, "../", "public", "avatars");
const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "This email is busy");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const result = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  res.status(200).json({
    email: result.email,
    subscription: result.subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
  });
};

const current = async (req, res) => {
  const { email } = req.user;
  res.json({
    email,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({
    message: "Logout success ",
  });
};
const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { path: tempUpload, filename } = req.file;

  // const image = await Jimp.read(tempUpload);
  // await image.resize(200, 200);
  // await image.writeAsync(tempUpload);

  await Jimp.read(tempUpload)
    .then((img) => {
      return img.resize(250, 250).quality(60).writeAsync(tempUpload);
    })
    .catch((err) => {
      console.error(err);
    });

  const nameAvatar = `${_id}_${filename}`;
  const resultUpload = path.join(dirAvatar, filename);
  const avatarURL = path.join("avatars", nameAvatar);
  await fs.rename(tempUpload, resultUpload);
  await User.findByIdAndUpdate(_id, { avatarURL });
  console.log(tempUpload, "temp");

  res.status(200).json({ avatarURL });
};
module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
