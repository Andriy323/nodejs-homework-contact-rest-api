const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
const {nanoid} = require("nanoid")
const gravatar = require("gravatar");
const ctrlWrapper = require("../utils/ctrlWrapper");
const { HttpError, sendEmail } = require("../helpers");

const { User } = require("../shema/shema-user");
const { SECRET_KEY, URL_BASE } = process.env;

const dirAvatar = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "This email is busy");
  }
  const verificationToken = nanoid()

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const result = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="${URL_BASE}/api/users/verify/${verificationToken}">Click verify email</a>`
    }
await sendEmail(verifyEmail)

  res.status(200).json({
    email: result.email,
    subscription: result.subscription,
  });
};

const verify = async(req, res) => {
  const {verificationToken} = req.params
  const user = await User.findOne({verificationToken})
  if(!user){
    throw HttpError(404, "Email not found")
  }
  await User.findByIdAndUpdate(user._id, {verify:true, verificationToken: ""})

  res.json({
    message: "Email verify succes"
  })
}


const resendEmailVerify = async(req,res) =>{
  const {email} = req.body
  const user = await User.findOne({email})
  if(!user){
      throw HttpError(404, "Email not found")
  }
  if(user.verify){
    throw HttpError(400, "Email verify")
  }

  const verifyEmail = {
    to: email,
    subject: 'ferify email',
    html: `<a target="_blank" href="${URL_BASE}/api/users/verify/:${user.verificationToken}">Click verify email</a>`
    }
await sendEmail(verifyEmail)
res.json({
  message: "Email resend succes"
})
}


const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
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
  const nameAvatar = `${_id}_${filename}`;
  const resultUpload = path.join(dirAvatar, filename);
  const avatarURL = path.join("avatars", nameAvatar);
  await fs.rename(tempUpload, resultUpload);
  await User.findByIdAndUpdate(_id, { avatarURL });
  const image = await Jimp.read(tempUpload);
  await image.resize(250, 250);
  await image.writeAsync(tempUpload);

  res.status(200).json({ avatarURL });
};
module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  verify: ctrlWrapper(verify),
  resendEmailVerify: ctrlWrapper(resendEmailVerify)
};
