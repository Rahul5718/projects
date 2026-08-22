document.addEventListener("DOMContentLoaded", () => {
  const recipeForm = document.getElementById("recipeForm");

  const currentUser = JSON.parse(localStorage.getItem("mockUser"));
  if (!currentUser) {
    alert("You must be logged in to submit a recipe.");
    window.location.href = "/login";
    return;
  }

  recipeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("recipeTitle").value.trim();
    const category = document.getElementById("category").value;
    const diet = document.getElementById("diet").value;
    const difficulty = document.getElementById("difficulty").value;
    const prepTime = document.getElementById("prepTime").value.trim();
    const servings = document.getElementById("servings").value.trim();
    const imageURL = document.getElementById("imageURL").value.trim();
    const ingredientsRaw = document.getElementById("ingredients").value.trim();
    const instructionsRaw = document.getElementById("instructions").value.trim();

    // Convert multi-line strings into arrays
    const ingredientsArray = ingredientsRaw.split("\n").map(i => i.trim()).filter(Boolean);
    const instructionsArray = instructionsRaw.split("\n").map(s => s.trim()).filter(Boolean);

    const newRecipe = {
      title: title,
      category: category,
      diet: diet,
      difficulty: difficulty,
      prepTime: prepTime,
      servings: servings,
      image: imageURL || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=500&q=80",
      ingredients: ingredientsArray,
      instructions: instructionsArray,
      createdAt: new Date().toISOString()
    };
    try {
          const token = localStorage.getItem("token");

          const response = await fetch("/api/recipes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` // Pass JWT token
            },
            body: JSON.stringify(newRecipe)
          });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to create recipe");
        }

      alert("Recipe published successfully!");
      window.location.href = "/profile"
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  });
});