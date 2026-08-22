const Recipe = require("../models/Recipe");

const mongoose = require("mongoose")
const validRecipeId = (id) => mongoose.isValidObjectId(id);

exports.createRecipe = async (req, res) => {
  try {
    const { title, category, diet, difficulty, prepTime, servings, image, ingredients, instructions } = req.body;

    const recipe = await Recipe.create({
      title,
      category,
      diet,
      difficulty,
      prepTime,
      servings,
      image,
      ingredients,
      instructions,
      author: req.user._id
    });

    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecipes = async (req, res) => {
  try {
    const { q, category, diet, difficulty, maxTime, sort } = req.query;
    let queryObj = {};

    // 1. Keyword search (Title or Ingredients)
    if (q) {
      queryObj.$or = [
        { title: { $regex: q, $options: "i" } },
        { ingredients: { $regex: q, $options: "i" } }
      ];
    }

    // 2. Exact Filters
    if (category && category !== "All") queryObj.category = category;
    if (diet && diet !== "All") queryObj.diet = diet;
    if (difficulty && difficulty !== "All") queryObj.difficulty = difficulty;
    if (maxTime) queryObj.prepTime = { $lte: Number(maxTime) };

    // 3. Sorting logic
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === "fastest") sortOption = { prepTime: 1 };
    if (sort === "alphabetical") sortOption = { title: 1 };

    const recipes = await Recipe.find(queryObj)
      .populate("author", "name")
      .sort(sortOption);

    res.json({ count: recipes.length, recipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    if (!validRecipeId(req.params.id)) {
      return res.status(400).json({ message: "Invalid recipe ID." });
    }

    const recipe = await Recipe.findById(req.params.id).populate("author", "name bio");
    if (!recipe) return res.status(404).json({ message: "Recipe not found." });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    if (!validRecipeId(req.params.id)) {
      return res.status(400).json({ message: "Invalid recipe ID." });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found." });

    // Authorization check
    if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to edit this recipe." });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    if (!validRecipeId(req.params.id)) {
      return res.status(400).json({ message: "Invalid recipe ID." });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found." });

    if (recipe.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to delete this recipe." });
    }

    await recipe.deleteOne();
    res.json({ message: "Recipe removed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};