const express = require("express");
const router = express.Router();
const {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe
} = require("../controller/recipeController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getRecipes).post(protect, createRecipe);
router.route("/:id").get(getRecipeById).put(protect, updateRecipe).delete(protect, deleteRecipe);

module.exports = router;