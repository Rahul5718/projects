document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");

  if (!/^[a-f\d]{24}$/i.test(recipeId || "")) {
    alert("This recipe link is invalid. Please select a recipe from the catalog.");
    window.location.href = "/recipes";
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("mockUser")) || { name: "Guest User" };

  // 1. Fetch recipe from MongoDB backend
  let recipe;
  try {
    recipe = await API.request(`/api/recipes/${recipeId}`);
  } catch (error) {
    alert(error.message);
    window.location.href = "/recipes";
    return;
  }

  // 2. Fetch User Favorites to determine initial button state
  let isFavorited = false;
  try {
    const userFavorites = await API.favorites();
    isFavorited = Array.isArray(userFavorites) && userFavorites.some(fav => (fav._id || fav).toString() === recipe._id.toString());
  } catch (err) {
    // Guest or unauthenticated state
    isFavorited = false;
  }

  const authorName = recipe.author?.name || recipe.authorName || "Community Chef";
  const following = JSON.parse(localStorage.getItem("userFollowing")) || [];
  const isFollowing = following.includes(authorName);

  // 3. Render Recipe Details & Sidebar Actions (including Favorite Button)
  const container = document.getElementById("recipeDetailsContainer");
  container.innerHTML = `
    <div>
      <img src="${recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=500&q=80'}" class="detail-img" alt="${recipe.title}">
      <h1>${recipe.title}</h1>
      <p style="color: #64748b; margin-bottom: 16px;">
        By <strong>${authorName}</strong>
        <button id="followBtn" style="margin-left: 8px; padding: 3px 10px; font-size: 0.75rem; border-radius: 4px; border: 1px solid #2563eb; background: ${isFollowing ? '#2563eb' : 'transparent'}; color: ${isFollowing ? '#fff' : '#2563eb'}; cursor: pointer;">
          ${isFollowing ? '✓ Following' : '+ Follow'}
        </button>
      </p>

      <div style="display: flex; gap: 8px; margin-bottom: 20px;">
        <span class="badge badge-diet">${recipe.diet || 'General'}</span>
        <span class="badge badge-diff">${recipe.difficulty || 'Easy'}</span>
        <span class="badge">${recipe.category || 'Dishes'}</span>
      </div>

      <h3>Ingredients</h3>
      <ul style="margin: 10px 0 20px 20px; line-height: 1.6;">
        ${(recipe.ingredients || []).map(i => `<li>${i}</li>`).join("")}
      </ul>

      <h3>Instructions</h3>
      <ol style="margin: 10px 0 20px 20px; line-height: 1.6;">
        ${(recipe.instructions || []).map(s => `<li>${s}</li>`).join("")}
      </ol>
    </div>

    <div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; position: sticky; top: 90px;">
        <h4>Actions</h4>
        <button id="favToggle" class="btn-add" style="width: 100%; margin-top: 10px; background-color: ${isFavorited ? '#ef4444' : '#2563eb'};">
          ${isFavorited ? '💔 Remove from Favorites' : '❤️ Add to Favorites'}
        </button>
        <button id="openModalBtn" class="btn-add" style="width: 100%; margin-top: 10px; background-color: #059669;">
          📁 Add to Collection
        </button>
      </div>
    </div>
  `;

  // 4. Favorite Button Click Handler
  const favBtn = document.getElementById("favToggle");
  favBtn.addEventListener("click", async () => {
    try {
      const data = await API.toggleFavorite(recipe._id);
      isFavorited = data.favorited;
      favBtn.innerHTML = isFavorited ? "💔 Remove from Favorites" : "❤️ Add to Favorites";
      favBtn.style.backgroundColor = isFavorited ? "#ef4444" : "#2563eb";
      alert(data.message);
    } catch (error) {
      alert(error.message);
    }
  });

  // 5. Follow / Unfollow Handler
  document.getElementById("followBtn").addEventListener("click", () => {
    let fList = JSON.parse(localStorage.getItem("userFollowing")) || [];
    const idx = fList.indexOf(authorName);

    if (idx > -1) {
      fList.splice(idx, 1);
    } else {
      fList.push(authorName);
      logActivity(`${currentUser.name} started following ${authorName}`);
    }

    localStorage.setItem("userFollowing", JSON.stringify(fList));
    location.reload();
  });

  // 6. Star Rating UI Handler
  let selectedRating = 5;
  const stars = document.querySelectorAll("#starContainer i");
  if (stars.length > 0) {
    stars.forEach(s => {
      s.addEventListener("click", () => {
        selectedRating = parseInt(s.dataset.val);
        stars.forEach(star => star.classList.toggle("active", parseInt(star.dataset.val) <= selectedRating));
      });
    });
    stars.forEach(star => star.classList.toggle("active", parseInt(star.dataset.val) <= 5));
  }

  // 7. Submit Review Handler
  const reviewForm = document.getElementById("reviewForm");
  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const comment = document.getElementById("reviewText").value.trim();
      const allReviews = JSON.parse(localStorage.getItem("recipeReviews")) || {};

      if (!allReviews[recipeId]) allReviews[recipeId] = [];
      allReviews[recipeId].unshift({
        user: currentUser.name,
        rating: selectedRating,
        comment: comment,
        date: new Date().toLocaleDateString()
      });

      localStorage.setItem("recipeReviews", JSON.stringify(allReviews));
      logActivity(`${currentUser.name} rated "${recipe.title}" ${selectedRating} Stars ⭐`);
      document.getElementById("reviewText").value = "";
      renderReviews();
    });
  }

  function renderReviews() {
    const revContainer = document.getElementById("reviewsList");
    if (!revContainer) return;

    const allReviews = JSON.parse(localStorage.getItem("recipeReviews")) || {};
    const list = allReviews[recipeId] || [];

    if (list.length === 0) {
      revContainer.innerHTML = "<p style='color: #64748b;'>No reviews yet. Be the first to try and review!</p>";
      return;
    }

    revContainer.innerHTML = list.map(r => `
      <div class="review-box">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <strong>${r.user}</strong>
          <span style="color: #f59e0b;">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
        </div>
        <p style="font-size: 0.9rem; color: #334155;">${r.comment}</p>
        <small style="color: #94a3b8;">${r.date}</small>
      </div>
    `).join("");
  }
  renderReviews();

  // 8. Collection Modal Controls
  const modal = document.getElementById("collectionModal");
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const saveCollectionBtn = document.getElementById("saveCollectionBtn");

  if (openModalBtn && modal) {
    openModalBtn.addEventListener("click", async () => {
      let cols;
      try {
        cols = await API.collections();
      } catch (error) {
        alert(error.message);
        return;
      }

      document.getElementById("collectionCheckboxes").innerHTML = cols.map(c => `
        <label style="display: block; margin: 8px 0; font-size: 0.9rem; cursor: pointer;">
          <input type="checkbox" value="${c._id}" ${c.recipes.some(item => (item._id || item).toString() === recipe._id.toString()) ? "checked" : ""}> ${c.name}
        </label>
      `).join("");
      modal.classList.add("active");
    });
  }

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener("click", () => modal.classList.remove("active"));
  }

  if (saveCollectionBtn && modal) {
    saveCollectionBtn.addEventListener("click", async () => {
      const checkboxes = document.querySelectorAll("#collectionCheckboxes input");

      try {
        const cols = await API.collections();
        await Promise.all(cols.map((collection) => {
          const checkbox = [...checkboxes].find(item => item.value === collection._id);
          const containsRecipe = collection.recipes.some(item => (item._id || item).toString() === recipe._id.toString());
          if (checkbox && checkbox.checked !== containsRecipe) {
            return API.request(`/api/collections/${collection._id}/toggle-recipe`, {
              method: "PUT",
              body: JSON.stringify({ recipeId: recipe._id })
            });
          }
          return null;
        }));
        modal.classList.remove("active");
        alert("Saved to collections!");
      } catch (error) {
        alert(error.message);
      }
    });
  }

  function logActivity(text) {
    const stream = JSON.parse(localStorage.getItem("activityStream")) || [];
    stream.unshift({ text, date: "Just now" });
    localStorage.setItem("activityStream", JSON.stringify(stream));
  }
});