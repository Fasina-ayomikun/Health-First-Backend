const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const checkError = require("../utils/checkError");
const checkPermission = require("../utils/checkPermission");
const User = require("../models/User");

const singleUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findById({ _id: userId });

    if (!user) {
      throw new NotFoundError(`No user with id: ${userId}`);
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        displayName: user.displayName,
        bio: user.bio,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    checkError(res, error);
  }
};
module.exports = {
  singleUser,
};
