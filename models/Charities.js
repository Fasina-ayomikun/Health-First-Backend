const mongoose = require("mongoose");
var validator = require("validator");

const CharitiesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide a title "],
    },
    description: {
      type: String,
      required: [true, "Please provide a short description"],
      maxLength: 1000,
    },
    image: {
      type: String,
      required: [true, "Please provide an image for your Charities"],
    },
    video: {
      type: String,
    },
    amountNeeded: {
      type: Number,
      required: [true, "Please provide the amount needed"],
    },
    amountDonated: {
      type: Number,
      default: 0,
    },

    listOfDonors: {
      type: Array,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Charities", CharitiesSchema);
