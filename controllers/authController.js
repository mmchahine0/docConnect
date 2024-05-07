const User = require('../models/userModel.js');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const ms = require('ms');


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
};

const createToken = (user, role, statusCode, message, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + ms(process.env.JWT_COOKIE_EXPIRES_IN)),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'None',
  };
  res.status(statusCode).cookie('jwt', token, cookieOptions).json({ role, message, status: 200, token });
};

exports.login = async (req, res) => {
  try {
    const checkUser = await User.findOne({ email: req.body.email });
    if (!(validator.isEmail(req.body.email))) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (!checkUser) {
      return res.status(404).json({ message: "User is not found" });
    }
    if (!(await checkUser.checkPassword(req.body.password, checkUser.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    return createToken(checkUser, checkUser.role, 200, `Welcome ${checkUser.fullname} !`, res);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong during the log in process, Please try again later." });
  }
};

exports.signup = async (req, res) => {
  try {
    const userCheck = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
    if (!validator.isEmail(req.body.email)) {
      return res.status(400).json({ message: "Invalid email" })
    }

    if (userCheck) {
      return res.status(409).json({ message: "Username or email already exists" });
    }

    const newUser = await User.create({
      fullname: req.body.fullname,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    return createToken(newUser, newUser.role, 201, `Dear ${req.body.fullname} your account was created successfully! `, res);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong during the sign up process, Please try again later." });
  }
}

exports.checkAdmin = async (req, res, next) => {
  try {
    const user = req.user;

    if (user && user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "You do not have permission to access this resource" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error while checking admin status" });
  }
};

exports.makeDoctor = async (req, res) => {
  try {

    const userId = req.body.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "doctor") {
      return res.status(400).json({ message: "User is already a doctor" });
    }
    user.role = "doctor";

    await user.save();

    return res.status(200).json({ message: "User's role updated to doctor" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating user's role" });
  }
};



exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (newPassword === oldPassword) {
      return res.status(400).json({ message: "New password must be different from the old password" });
    }

    const isPasswordCorrect = await user.checkPassword(oldPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong during the update process, please try again later." });
  }
};


exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ message: "You are not logged in, Please log in to get access" })
    }
    let decoded;
    try {
      decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token. Please log in again" });
      }
      else if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Your session were expired. Please log in again"
        })
      }
    }
    const checkUser = await User.findById(decoded.id)
    if (!checkUser) {
      return res.status(404).json({ message: "The user belonging to this session does no longer exist" })
    }

    if (checkUser.passwordChangedAfterTokenIssued(decoded.iat)) {
      return res.status(401).json({ message: "You recently changed your password. Please log in again" })
    }
    req.user = checkUser;
    next();
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Something went wrong during the process, Please try again later." })
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const doctor = await User.findById(req.user._id)
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    if (doctor.role !== "doctor" && doctor.role !== "admin") {
      return res.status(403).json({ message: "You're not authorized" });
    }

    const users = await User.find({ role: "user" });

    if (users.length == 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({ users });
  } catch (err) {
    console.log(err)
  }
}