const BadRequestError = require("../errors/bad-request");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const NotFoundError = require("../errors/not-found");
const { addCookies } = require("../utils/addCookies");
const checkError = require("../utils/checkError");
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, password2 } = req.body;
    if (!firstName || !lastName || !email || !password || !password2) {
      throw new BadRequestError("Please provide all credentials");
    }
    // Check if Passwords Match
    if (password !== password2) {
      throw new BadRequestError("Passwords do not match");
    }
    // Check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      throw new BadRequestError("Email already exists");
    }
    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = await User.create({ ...req.body, password: hash });

    //  Create Token and Add to cookie
    addCookies({ res, user: newUser });
    console.log(user);
    res.status(201).json({
      success: true,
      msg: "User successfully created",
      user: {
        _id: newUser._id,
        firstName,
        lastName,
        email,

        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    checkError(res, error);
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("Please provide all credentials");
    }
    // Check if user exist
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError("Email does not exist");
    }
    // Compare password
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestError("Incorrect Password");
    }
    addCookies({ res, user });
    res.status(200).json({
      success: true,
      msg: "User successfully logged in",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    checkError(res, error);
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res
      .status(200)
      .json({ success: true, msg: "User successfully logged out" });
  } catch (error) {
    checkError(res, error);
  }
};

module.exports = {
  register,
  login,
  logout,
};
