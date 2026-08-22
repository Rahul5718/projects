document.addEventListener("DOMContentLoaded", async () => {
  const storedUser = JSON.parse(localStorage.getItem("mockUser"));

  if (!storedUser || !localStorage.getItem("token")) {
    alert("Please log in to view your profile.");
    window.location.href = "/login";
    return;
  }

  let userRecipes;
  let userFavorites;

  // Populate User Info
  const displayName = document.getElementById("displayName");
  const displayBio = document.getElementById("displayBio");
  const profileAvatar = document.getElementById("profileAvatar");
  const contributedBadge = document.getElementById("contributedBadge");
  const favoritesBadge = document.getElementById("favoritesBadge");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const locationInput = document.getElementById("location");
  const bioInput = document.getElementById("bio");

  function getInitials(name) {
    if (!name) return "U";
    return name.trim().split(" ").filter(Boolean).map((w) => w[0].toUpperCase()).slice(0, 2).join("");
  }

  function loadUserData(user) {
    if (displayName) displayName.textContent = user.name || "Chef";
    if (displayBio) displayBio.textContent = user.bio || "Home cook & culinary enthusiast.";
    if (profileAvatar) profileAvatar.textContent = getInitials(user.name);

    if (nameInput) nameInput.value = user.name || "";
    if (emailInput) emailInput.value = user.email || "";
    if (phoneInput) phoneInput.value = user.phone || "";
    if (locationInput) locationInput.value = user.location || "";
    if (bioInput) bioInput.value = user.bio || "";

    if (contributedBadge) contributedBadge.textContent = `${userRecipes.length} Contributed`;
    if (favoritesBadge) favoritesBadge.textContent = `${userFavorites.length} Favorited`;
  }

  try {
    const [user, recipes, favorites] = await Promise.all([
      API.profile(), API.myRecipes(), API.favorites()
    ]);
    userRecipes = recipes;
    userFavorites = favorites;
    loadUserData(user);
  } catch (error) {
    alert(error.message);
    return;
  }

  // Profile Form Save
  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    profileForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const updatedUser = {
        ...storedUser,
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        location: locationInput.value.trim(),
        bio: bioInput.value.trim(),
      };
      try {
        const savedUser = await API.request("/api/profile/me", {
          method: "PUT",
          body: JSON.stringify(updatedUser)
        });
        localStorage.setItem("mockUser", JSON.stringify(savedUser));
        loadUserData(savedUser);
        alert("Profile updated successfully!");
      } catch (error) {
        alert(error.message);
      }
    });
  }

  // Render Contributed Recipes
  renderContributedRecipes(userRecipes);

  // Render Favorite Recipes
  renderFavoriteRecipes(userFavorites);
});

// Tab Switcher
function openTab(evt, tabName) {
  const tabContents = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove("active");
  }
  const tabButtons = document.getElementsByClassName("tab-btn");
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active");
  }
  document.getElementById(tabName).classList.add("active");
  evt.currentTarget.classList.add("active");
}

// Render Contributed Recipes from LocalStorage
function renderContributedRecipes(recipes) {
  const container = document.getElementById("contributedGrid");
  if (!container) return;

  if (recipes.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #6b7280;">
        <i class="ri-restaurant-line" style="font-size: 2.5rem; display: block; margin-bottom: 8px;"></i>
        <p>You haven't submitted any recipes yet.</p>
        <a href="/add-recipe" class="btn-primary" style="display: inline-block; margin-top: 12px; text-decoration: none;">Create Your First Recipe</a>
      </div>
    `;
    return;
  }

  container.innerHTML = recipes
    .map(
      (item) => `
      <div class="recipe-card" id="recipe-${item.id}">
        <img src="${item.image}" alt="${item.title}" class="recipe-img">
        <div class="recipe-body">
          <h3>${item.title}</h3>
          <p class="recipe-meta-text">⏳ ${item.prepTime} mins • 🍽️ ${item.servings || '2'} servings • ${item.category}</p>
          <div class="recipe-actions">
            <a href="/recipe-details?id=${item._id || item.id}">View Details</a>
            <button class="btn-danger-outline" onclick="deleteRecipe('${item._id || item.id}')">Delete</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

// Delete Recipe from LocalStorage
async function deleteRecipe(id) {
  if (!confirm("Are you sure you want to delete this recipe?")) return;

  try {
    await API.request(`/api/recipes/${id}`, { method: "DELETE" });
    window.location.reload();
  } catch (error) {
    alert(error.message);
  }
}

// Render Favorite Recipes
function renderFavoriteRecipes(favorites) {
  const container = document.getElementById("favoritesGrid");
  if (!container) return;

  if (favorites.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #6b7280;">
        <i class="ri-heart-line" style="font-size: 2.5rem; display: block; margin-bottom: 8px;"></i>
        <p>No favorite recipes saved yet.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = favorites
    .map(
      (item) => `
      <div class="recipe-card" id="fav-${item.id}">
        <img src="${item.image}" alt="${item.title}" class="recipe-img">
        <div class="recipe-body">
          <h3>${item.title}</h3>
          <p class="recipe-meta-text">By: ${item.authorName || 'Chef'} • ${item.category}</p>
          <div class="recipe-actions">
            <a href="/recipe-details?id=${item._id || item.id}">View Recipe</a>
            <button class="btn-danger-outline" onclick="removeFavorite('${item._id || item.id}')">Remove</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

async function removeFavorite(id) {
  try {
    await API.request(`/api/favorites/toggle/${id}`, { method: "POST" });
    window.location.reload();
  } catch (error) {
    alert(error.message);
  }
}

function renderFavorites() {
  const container = document.getElementById("favoritesGrid");
  const favoritesBadge = document.getElementById("favoritesBadge");

  // Retrieve saved favorites from localStorage
  const userFavorites = JSON.parse(localStorage.getItem("userFavorites")) || [];

  // Update count badge
  if (favoritesBadge) {
    favoritesBadge.textContent = `${userFavorites.length} Favorited`;
  }

  // If empty
  if (userFavorites.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #64748b;">
        <p>No favorite recipes saved yet.</p>
        <a href="/recipes" style="color: #2563eb; font-weight: 600;">Browse Recipes</a>
      </div>
    `;
    return;
  }

  // Render cards
  container.innerHTML = userFavorites.map(recipe => `
    <div class="recipe-card" id="fav-${recipe.id}">
      <img src="${recipe.image}" alt="${recipe.title}" class="recipe-img">
      <div class="recipe-body">
        <h3>${recipe.title}</h3>
        <p class="recipe-meta-text">By ${recipe.authorName || 'Chef'} • ⏳ ${recipe.prepTime} mins</p>
        <div class="recipe-actions">
          <a href="/recipe-details?id=${recipe._id || recipe.id}">View Recipe</a>
          <button class="btn-danger-outline" onclick="removeFavoriteFromProfile(${recipe.id})">Remove</button>
        </div>
      </div>
    </div>
  `).join("");
}

// Function to remove favorite directly from Profile page
window.removeFavoriteFromProfile = function(id) {
  let userFavorites = JSON.parse(localStorage.getItem("userFavorites")) || [];
  userFavorites = userFavorites.filter(fav => fav.id !== id);
  localStorage.setItem("userFavorites", JSON.stringify(userFavorites));
  renderFavorites(); // re-render grid
};