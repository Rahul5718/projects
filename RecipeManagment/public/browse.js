document.addEventListener("DOMContentLoaded", async () => {
  const defaultCatalog = [
    {
      id: 1001,
      title: "Creamy Garlic Tuscan Pasta",
      category: "Dinner",
      diet: "Vegetarian",
      difficulty: "Easy",
      prepTime: 25,
      servings: 4,
      authorName: "Chef Antonio",
      image: "https://images.unsplash.com/photo-1621996346565-e3d5d62817ee?auto=format&fit=crop&w=500&q=80",
      ingredients: ["fettuccine", "heavy cream", "garlic", "spinach", "sun-dried tomatoes", "parmesan"]
    },
    {
      id: 1002,
      title: "Avocado Sourdough Toast",
      category: "Breakfast",
      diet: "Vegetarian",
      difficulty: "Easy",
      prepTime: 10,
      servings: 2,
      authorName: "Sarah Jenkins",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=500&q=80",
      ingredients: ["sourdough bread", "avocado", "chili flakes", "poached egg", "lemon juice"]
    },
    {
      id: 1003,
      title: "Rustic Margherita Pizza",
      category: "Dinner",
      diet: "Vegetarian",
      difficulty: "Medium",
      prepTime: 45,
      servings: 3,
      authorName: "Jane Doe",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80",
      ingredients: ["pizza dough", "san marzano tomatoes", "fresh mozzarella", "basil", "olive oil"]
    }
  ];

  let allRecipes = [];

  const grid = document.getElementById("recipesGrid");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const dietFilter = document.getElementById("dietFilter");
  const diffFilter = document.getElementById("diffFilter");
  const timeFilter = document.getElementById("timeFilter");
  const timeText = document.getElementById("timeText");
  const sortSelect = document.getElementById("sortSelect");
  const countText = document.getElementById("countText");
  const resetBtn = document.getElementById("resetBtn");

  if (!grid) return;

  async function loadRecipes() {
    try {
      const params = new URLSearchParams(window.location.search);
      const data = await API.recipes(params.toString() ? `?${params}` : "");
      allRecipes = data.recipes || [];
      render();
    } catch (error) {
      allRecipes = [];
      render();
      alert(`Could not load recipes: ${error.message}`);
    }
  }

  function render() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const cat = categoryFilter ? categoryFilter.value : "All";
    const diet = dietFilter ? dietFilter.value : "All";
    const diff = diffFilter ? diffFilter.value : "All";
    const maxTime = timeFilter ? parseInt(timeFilter.value) : 120;

    if (timeText) {
      timeText.textContent = maxTime >= 120 ? "Any time (≤ 2 hrs)" : `≤ ${maxTime} mins`;
    }

    let filtered = allRecipes.filter((r) => {
      const title = (r.title || "").toLowerCase();
      const rCat = (r.category || "dinner").toLowerCase();
      const rDiet = (r.diet || "vegetarian").toLowerCase();
      const rDiff = (r.difficulty || "easy").toLowerCase();
      const rTime = parseInt(r.prepTime) || 30;

      let ingMatch = false;
      if (Array.isArray(r.ingredients)) {
        ingMatch = r.ingredients.some((i) => (i || "").toLowerCase().includes(query));
      } else if (typeof r.ingredients === "string") {
        ingMatch = r.ingredients.toLowerCase().includes(query);
      }

      const matchSearch = query === "" || title.includes(query) || ingMatch;
      const matchCat = cat === "All" || rCat === cat.toLowerCase();
      const matchDiet = diet === "All" || rDiet === diet.toLowerCase();
      const matchDiff = diff === "All" || rDiff === diff.toLowerCase();
      const matchTime = rTime <= maxTime;

      return matchSearch && matchCat && matchDiet && matchDiff && matchTime;
    });

    if (sortSelect) {
      if (sortSelect.value === "fastest") {
        filtered.sort((a, b) => (parseInt(a.prepTime) || 0) - (parseInt(b.prepTime) || 0));
      } else if (sortSelect.value === "az") {
        filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      }
    }

    if (countText) {
      countText.textContent = `Showing ${filtered.length} recipe${filtered.length === 1 ? "" : "s"}`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: #64748b;">
          <i class="ri-search-eye-line" style="font-size: 2.5rem; display: block; margin-bottom: 8px;"></i>
          <h3>No recipes match your criteria</h3>
          <p>Try resetting or relaxing your filters.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered
      .map(
        (r) => `
        <div class="recipe-card">
          <img src="${r.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=500&q=80'}" alt="${r.title}" class="recipe-img">
          <div class="recipe-body">
            <div class="badge-row">
              <span class="badge badge-diet">${r.diet || 'Vegetarian'}</span>
              <span class="badge badge-diff">${r.difficulty || 'Easy'}</span>
            </div>
            <h3>${r.title}</h3>
            <p class="recipe-meta">⏳ ${r.prepTime} mins • 🍽️ ${r.servings || '2'} Servings • ${r.category || 'General'}</p>
            <div class="recipe-actions">
              <a href="/recipe-details?id=${r._id || r.id}">View Recipe</a>
            </div>
          </div>
        </div>
      `
      )
      .join("");
  }

  if (searchInput) searchInput.addEventListener("input", render);
  if (categoryFilter) categoryFilter.addEventListener("change", render);
  if (dietFilter) dietFilter.addEventListener("change", render);
  if (diffFilter) diffFilter.addEventListener("change", render);
  if (timeFilter) timeFilter.addEventListener("input", render);
  if (sortSelect) sortSelect.addEventListener("change", render);

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (categoryFilter) categoryFilter.value = "All";
      if (dietFilter) dietFilter.value = "All";
      if (diffFilter) diffFilter.value = "All";
      if (timeFilter) timeFilter.value = "120";
      render();
    });
  }

  loadRecipes();
});