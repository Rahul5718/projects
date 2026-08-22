const User = require("../models/User");
const Recipe = require("../models/recipe");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.location = req.body.location || user.location;

      if (req.body.password) {
        user.password = req.body.password; // Triggers pre-save hash
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        bio: updatedUser.bio,
        location: updatedUser.location
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getMyFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "favorites",
      populate: { path: "author", select: "name" }
    });
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};