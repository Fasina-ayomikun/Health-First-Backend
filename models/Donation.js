const mongoose = require("mongoose");
var validator = require("validator");

const DonationSchema = new mongoose.Schema(
  {
    amountDonated: {
      type: Number,
      required: [true, "Please provide an amount"],
    },

    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    charity: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Charities",
    },
  },
  { timestamps: true }
);

DonationSchema.statics.calculateDonation = async function (charityId) {
  const result = await this.aggregate([
    { $match: { charity: charityId } },
    {
      $group: {
        _id: null,
        amountDonated: { $sum: "$amountDonated" },
      },
    },
  ]);
  try {
    await this.model("Charities").findOneAndUpdate(
      { _id: charityId },
      {
        amountDonated: result[0]?.amountDonated || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};
// Call method when Donations is updated
DonationSchema.post("save", async function () {
  await this.constructor.calculateDonation(this.charity);
});
// Call method when Donations is deleted
DonationSchema.post("remove", async function () {
  await this.constructor.calculateDonation(this.charity);
});

module.exports = mongoose.model("Donation", DonationSchema);
