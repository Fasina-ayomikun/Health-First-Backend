const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const Charities = require("../models/Charities");
const Donation = require("../models/Donation");
const checkError = require("../utils/checkError");
const checkPermission = require("../utils/checkPermission");

const createDonation = async (req, res) => {
  try {
    const { charity: charityId } = req.body;
    // Check if charity Exists
    const isRealCharity = await Charities.findOne({ _id: charityId }).populate({
      path: "user",
      select: "firstName lastName email  createdAt",
    });
    if (!isRealCharity) {
      throw new BadRequestError("This charity does not exist");
    }
    let listOfDonors = [];
    req.body.user = req.user.userId;
    const userCharity = await Donation.find({
      charity: charityId,
      user: req.user.userId,
    });
    if (userCharity.length < 1) {
      listOfDonors.push(isRealCharity);
      await Charities.updateOne({ _id: charityId }, { listOfDonors });
    }
    const newDonation = await Donation.create(req.body);
    res.status(201).json({
      success: true,
      donation: newDonation,
      msg: "Donation successfully created",
    });
  } catch (error) {
    checkError(res, error);
  }
};
const getUserDonations = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const sort = { createdAt: -1 };
    const donations = await Donation.find({ user: id }).sort(sort).populate({
      path: "charity",
      select: "title description amountNeeded amountDonated",
    });
    res
      .status(200)
      .json({ success: true, donations, length: donations.length });
  } catch (error) {
    checkError(res, error);
  }
};
const getCharityDonations = async (req, res) => {
  try {
    const { charityId: id } = req.params;
    console.log(id);
    const sort = { createdAt: -1 };
    const donations = await Donation.find({ charity: id })
      .sort(sort)
      .populate({
        path: "charity",
        select: "title description amountNeeded amountDonated",
      })
      .populate({
        path: "user",
        select: "email firstName lastName",
      });
    res
      .status(200)
      .json({ success: true, donations, length: donations.length });
  } catch (error) {
    checkError(res, error);
  }
};
module.exports = {
  createDonation,
  getUserDonations,
  getCharityDonations,
};
