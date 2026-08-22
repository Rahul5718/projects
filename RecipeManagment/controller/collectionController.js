const User = require("../models/User");
const Collection = require("../models/collection");
const mongoose = require("mongoose");

exports.toggleFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(recipeId)) {
      return res.status(400).json({ message: "Invalid recipe ID." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if recipeId is already in user's favorites array (string comparison)
    const isFav = user.favorites.some(id => id.toString() === recipeId);

    if (isFav) {
      // Remove from favorites
      await User.findByIdAndUpdate(userId, {
        $pull: { favorites: recipeId }
      });
      return res.json({ message: "Recipe removed from favorites.", favorited: false });
    } else {
      // Add to favorites (prevents duplicates)
      await User.findByIdAndUpdate(userId, {
        $addToSet: { favorites: recipeId }
      });
      return res.json({ message: "Recipe saved to favorites.", favorited: true });
    }
  } catch (error) {
    console.error("Favorite toggle error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.createCollection = async (req, res) => {
  try {
    const { name } = req.body;
    const collection = await Collection.create({
      name,
      user: req.user._id,
      recipes: []
    });
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user._id }).populate("recipes", "title image prepTime");
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleRecipeInCollection = async (req, res) => {
  try {
    const { recipeId } = req.body;
    if (!mongoose.isValidObjectId(recipeId) || !mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid collection or recipe ID." });
    }

    const collection = await Collection.findOne({ _id: req.params.id, user: req.user._id });

    if (!collection) return res.status(404).json({ message: "Collection not found." });

    const exists = collection.recipes.some((id) => id.toString() === recipeId);
    if (exists) {
      collection.recipes = collection.recipes.filter((id) => id.toString() !== recipeId);
    } else {
      collection.recipes.push(recipeId);
    }

    await collection.save();
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};