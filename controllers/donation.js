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
    const isRealCharity = await Charities.findOne({ _id: charityId });
    if (!isRealCharity) {
      throw new BadRequestError("This charity does not exist");
    }
    let listOfDonors = [];
    req.body.user = req.user.userId;
    const userCharity = await Donation.find({
      charity: charityId,
      user: req.user.userId,
    });
    console.log(userCharity);
    if (userCharity.length < 1) {
      console.log("nahh");

      listOfDonors.push(isRealCharity);
      await Charities.updateOne({ _id: charityId }, { listOfDonors });
      console.log(listOfDonors);
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
module.exports = {
  createDonation,
};
