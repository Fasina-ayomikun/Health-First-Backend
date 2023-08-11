const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const charity = require("../models/Charities");
const checkError = require("../utils/checkError");
const path = require("path");
const checkPermission = require("../utils/checkPermission");
const Donation = require("../models/Donation");
const Charities = require("../models/Charities");
const getAllCharities = async (req, res) => {
  try {
    // Sort the charities with createdAt
    const sort = { createdAt: -1 };
    const charities = await charity.find().sort(sort).populate({
      path: "user",
      select: "firstName lastName email  createdAt",
    });
    res.json({ success: true, charities, length: charities.length });
  } catch (error) {
    checkError(res, error);
  }
};
const getUserCharities = async (req, res) => {
  try {
    const { userId } = req.params;
    const sort = { createdAt: -1 };
    const charities = await charity.find({ user: userId }).sort(sort);
    res
      .status(200)
      .json({ success: true, charities, length: charities.length });
  } catch (error) {
    checkError(res, error);
  }
};
const createCharity = async (req, res) => {
  try {
    req.body.user = req.user.userId;

    const charity = await Charities.create(req.body);
    res
      .status(201)
      .json({ success: true, msg: "Charity successfully created", charity });
  } catch (error) {
    checkError(res, error);
  }
};
const updateCharity = async (req, res) => {
  try {
    const { id: charityId } = req.params;
    const charity = await Charities.findOne({ _id: charityId });
    // Check if user is authorized to access this route
    console.log(charity);
    checkPermission(req.user.userId, charity.user);
    // Check if charity exists
    if (!charity) {
      throw new NotFoundError(`No charity with id: ${charityId}`);
    }
    await Charities.updateOne({ _id: charityId }, req.body);

    res
      .status(200)
      .json({ success: true, msg: "Charity successfully updated" });
  } catch (error) {
    checkError(res, error);
  }
};
const deleteCharity = async (req, res) => {
  try {
    const { id: charityId } = req.params;
    const charity = await Charities.findOne({ _id: charityId });
    console.log(charity);
    //  Check if charity exists
    if (!charity) {
      throw new NotFoundError(`No charity with id: ${charityId}`);
    }

    // Check if user is authorized to access this route
    checkPermission(req.user.userId, charity.user);
    await Charities.deleteOne({ _id: charityId });
    res
      .status(200)
      .json({ success: true, msg: "Charity successfully deleted" });
  } catch (error) {
    checkError(res, error);
  }
};
const singleCharity = async (req, res) => {
  try {
    const { id: charityId } = req.params;
    const charity = await Charities.findById({ _id: charityId });
    console.log(charity);

    if (!charity) {
      throw new NotFoundError(`No charity with id: ${charityId}`);
    }

    res.status(200).json({ success: true, charity });
  } catch (error) {
    checkError(res, error);
  }
};

module.exports = {
  getAllCharities,
  createCharity,
  updateCharity,
  deleteCharity,
  getUserCharities,
  singleCharity,
};
