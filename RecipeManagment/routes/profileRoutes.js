const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, getMyRecipes, getMyFavorites } = require("../controller/profileController")
const { protect } = require("../middleware/authMiddleware");

router.route("/me").get(protect, getProfile).put(protect, updateProfile);
router.get("/contributions", protect, getMyRecipes);
router.get("/favorites", protect, getMyFavorites);

module.exports = router;