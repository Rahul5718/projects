const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const path = require('path')

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.static(path.join(__dirname,'public')))

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/recipes", require("./routes/recipeRoutes"));
app.use("/api", require("./routes/collectionRoutes"));

// Root / Healthcheck
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "registration.html"));
});

app.get(["/login", "/login.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "view", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "registration.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "dashboard.html"));
});

app.get("/recipes", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "recipes.html"));
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "profile.html"));
});

app.get("/collection", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "collection.html"));
});

app.get("/feed", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "feed.html"));
});

app.get("/add-recipe", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "add-recipe.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "admin.html"));
})

// Chrome DevTools checks this optional metadata endpoint.
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.status(204).end();
});

app.get("/recipe-details",(req,res)=>{
     res.sendFile(path.join(__dirname,'view',"recipe-details.html"))
})

app.get("/profile",(req,res)=>{
     res.sendFile(path.join(__dirname,'view','profile.html'))
})

app.get("/index",(req,res)=>{
     res.sendFile(path.join(__dirname,'view','dashboard.html'))
})

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})