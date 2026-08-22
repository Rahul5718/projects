const express = require("express");
const router = express.Router();
const {
  toggleFavorite,
  createCollection,
  getCollections,
  toggleRecipeInCollection
} = require("../controller/collectionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/favorites/toggle/:recipeId", protect, toggleFavorite);
router.post("/collections/favorites/toggle/:recipeId", protect, toggleFavorite);
router.route("/collection").get(protect, getCollections).post(protect, createCollection);
router.route("/collections").get(protect, getCollections).post(protect, createCollection);
router.put("/collection/:id/toggle-recipe", protect, toggleRecipeInCollection);
router.put("/collections/:id/toggle-recipe", protect, toggleRecipeInCollection);

module.exports = router;