const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack"]
    },
    diet: {
      type: String,
      required: true,
      enum: ["Vegetarian", "Vegan", "Gluten-Free", "Non-Vegetarian"]
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"]
    },
    prepTime: { type: Number, required: true }, // in minutes
    servings: { type: Number, required: true, default: 2 },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=500&q=80"
    },
    ingredients: [{ type: String, required: true }],
    instructions: [{ type: String, required: true }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// Indexing for search performance on title, ingredients, and category
recipeSchema.index({ title: "text", ingredients: "text", category: "text" });

module.exports =mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);