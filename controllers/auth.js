const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = user.createJWT();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // token expires in 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Reset your password",
      // text: `Click on this link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
      html: `
      <p>Hello,</p>
      <p>We received a request to reset your password for your account at the Task Manager. To reset your password, please click on the following link:</p>
      <p><a href="https://task-manager-app-mu.vercel.app/reset-password?token=${token}">https://task-manager-app-mu.vercel.app/reset-password?token=${token}</a></p>
      <p>Please note that this link will expire in 1 hour.</p>
      <p>If you did not make this request, you can safely ignore this email and your password will remain unchanged.</p>
      <p>Best regards,</p>
      <p>The lab Team</p>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Error sending email" });
      }

      res.json({ message: "Email sent successfully" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { password, token } = req.body;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: payload.userId,
    });
    if (!user) {
      return res
        .status(404)
        .json({ error: "Password reset token is invalid or has expired" });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // compare password
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  forgotPassword,
  resetPassword,
  register,
  login,
};
