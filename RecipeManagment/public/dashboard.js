document.addEventListener("DOMContentLoaded", async () => {
  // Keep the token in localStorage, but load application data from MongoDB.
  const storedUser = JSON.parse(localStorage.getItem("mockUser"));
  let userRecipes = [];
  let userFavorites = [];

  // 2. Authentication Route Protection
  if (!storedUser) {
    alert("No active session found. Redirecting to Login...");
    window.location.href = "/login";
    return;
  }

  try {
    [userRecipes, userFavorites] = await Promise.all([API.myRecipes(), API.favorites()]);
  } catch (error) {
    alert(error.message);
    return;
  }

  // 3. Populate Profile & Header Data
  const fullName = storedUser.name || "Chef";
  const firstName = fullName.trim().split(" ")[0];
  const initials = getInitials(fullName);

  // Update Welcome Banner
  const welcomeHeading = document.getElementById("welcomeHeading");
  if (welcomeHeading) {
    welcomeHeading.innerHTML = `Welcome back, ${firstName}! 👋`;
  }

  // Update Sidebar
  const sidebarUserName = document.getElementById("sidebarUserName");
  const sidebarAvatar = document.getElementById("sidebarAvatar");
  const sidebarFavCount = document.getElementById("sidebarFavCount");

  if (sidebarUserName) sidebarUserName.textContent = fullName;
  if (sidebarAvatar) sidebarAvatar.textContent = initials;
  if (sidebarFavCount) sidebarFavCount.textContent = userFavorites.length || "0";

  // 4. Update Dynamic KPI Statistics
  const kpiRecipesCount = document.getElementById("kpiRecipesCount");
  const kpiBookmarksCount = document.getElementById("kpiBookmarksCount");

  if (kpiRecipesCount) {
    // Show either actual stored recipes count or fallback baseline
    kpiRecipesCount.textContent = userRecipes.length > 0 ? userRecipes.length : "2";
  }

  if (kpiBookmarksCount) {
    kpiBookmarksCount.textContent = userFavorites.length > 0 ? userFavorites.length : "12";
  }

  // 5. Render Trending Recipes List dynamically
  renderDashboardRecipes(userRecipes);

  // 6. Sign Out Handler
  const signOutBtn = document.getElementById("signOutBtn");
  if (signOutBtn) {
    signOutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // Clear session data
      localStorage.removeItem("mockUser");
      localStorage.removeItem("token");
      window.location.href = "/login";
    });
  }

  // Add inside the DOMContentLoaded handler in dashboard.js:
const searchInput = document.querySelector(".search-bar input");
if (searchInput) {
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && searchInput.value.trim() !== "") {
      window.location.href = `/recipes?q=${encodeURIComponent(searchInput.value.trim())}`;
    }
  });
}

  // 7. Initialize Chart.js
  initPerformanceChart();

  setupPopovers()

  renderDashboardFavorites(userFavorites)
  renderRecentInteractions(userRecipes, userFavorites)
});



// Helper function to extract up to 2 uppercase initials
function getInitials(name) {
  if (!name) return "U";
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

// Render dynamic recipe cards
function renderDashboardRecipes(recipes) {
  const container = document.getElementById("dashboardRecipesContainer");
  if (!container) return;

  const defaultRecipes = [
    {
      _id: "1001",
      title: "Quinoa Salad Bowl",
      prepTime: 15,
      views: "14.2k",
      likes: "1.2k",
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80",
    },
    {
      _id: "1002",
      title: "Rustic Margherita Pizza",
      prepTime: 45,
      views: "9.8k",
      likes: "890",
      img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80",
    },
    {
      _id: "1003",
      title: "Classic Berry Cheesecake",
      prepTime: 60,
      views: "6.4k",
      likes: "520",
      img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=500&q=80",
    },
  ];

  const listToRender = recipes.length > 0 ? recipes : defaultRecipes;

  container.innerHTML = listToRender
    .slice(0, 3)
    .map(
      (recipe, index) => `
      <div class="recipe-mini-card">
        <div class="img-wrapper">
          <img src="${recipe.image || recipe.img || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=500&q=80'}" alt="${recipe.title}">
          <span class="badge-tag">Top #${index + 1}</span>
        </div>
        <div class="mini-card-details">
          <h4>${recipe.title}</h4>
          <div class="recipe-stats-row">
            <span><i class="ri-eye-line"></i> ${recipe.views || '1.2k'}</span>
            <span><i class="ri-heart-line"></i> ${recipe.likes || '450'}</span>
            <span><i class="ri-time-line"></i> ${recipe.prepTime ? recipe.prepTime + 'm' : '20m'}</span>
          </div>
          <div style="margin-top: 8px; display: flex; gap: 8px;">
            <a href="/recipe-details?id=${recipe._id || recipe.id}" style="color: #2563eb; font-size: 0.8rem; font-weight: 600;">View</a>
            <button onclick="toggleFavoriteDashboard('${recipe._id || recipe.id}')" style="background: none; border: none; color: #e11d48; font-size: 0.8rem; cursor: pointer;">❤️ Favorite</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}
// Chart.js initialization logic
function initPerformanceChart() {
  const chartElement = document.getElementById("performanceChart");
  if (!chartElement) return;

  const ctx = chartElement.getContext("2d");

  const viewGradient = ctx.createLinearGradient(0, 0, 0, 250);
  viewGradient.addColorStop(0, "rgba(37, 99, 235, 0.25)");
  viewGradient.addColorStop(1, "rgba(37, 99, 235, 0.0)");

  const favGradient = ctx.createLinearGradient(0, 0, 0, 250);
  favGradient.addColorStop(0, "rgba(244, 63, 94, 0.25)");
  favGradient.addColorStop(1, "rgba(244, 63, 94, 0.0)");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Views",
          data: [1200, 1900, 1500, 2800, 2400, 3600, 4200],
          borderColor: "#2563eb",
          backgroundColor: viewGradient,
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 3,
        },
        {
          label: "Bookmarks",
          data: [200, 320, 290, 450, 410, 680, 850],
          borderColor: "#f43f5e",
          backgroundColor: favGradient,
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            boxWidth: 6,
            font: { size: 12 },
          },
        },
      },
      scales: {
        y: {
          grid: { color: "#f1f5f9" },
          ticks: { font: { size: 11 }, color: "#94a3b8" },
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 }, color: "#94a3b8" },
        },
      },
    },
  });
}

// 1. Popover Handlers for Notifications & Messages
function setupPopovers() {
  const notifBtn = document.getElementById("notifBtn");
  const notifPopover = document.getElementById("notifPopover");
  const msgBtn = document.getElementById("msgBtn");
  const msgPopover = document.getElementById("msgPopover");

  if (notifBtn && notifPopover) {
    notifBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (msgPopover) msgPopover.classList.remove("active");
      notifPopover.classList.toggle("active");
    });
  }

  if (msgBtn && msgPopover) {
    msgBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (notifPopover) notifPopover.classList.remove("active");
      msgPopover.classList.toggle("active");
    });
  }

  document.addEventListener("click", () => {
    if (notifPopover) notifPopover.classList.remove("active");
    if (msgPopover) msgPopover.classList.remove("active");
  });

  // Populate dynamic notifications
  const notifications = [
    { icon: "ri-star-fill", text: "Chef Antonio gave 5 stars to your Pasta dish.", time: "12m ago" },
    { icon: "ri-user-follow-line", text: "Sarah Jenkins followed your profile.", time: "1h ago" },
    { icon: "ri-heart-3-line", text: "Your recipe was added to 'Weeknight Dinners'.", time: "4h ago" }
  ];

  const messages = [
    { name: "Chef Antonio", text: "What olive oil do you recommend?", time: "2h ago" },
    { name: "Support Team", text: "Welcome to Creator Studio!", time: "1d ago" }
  ];

  const notifBadge = document.getElementById("notifBadge");
  const notifContainer = document.getElementById("notifContainer");
  if (notifBadge && notifContainer) {
    notifBadge.textContent = `${notifications.length} New`;
    notifContainer.innerHTML = notifications.map(n => `
      <div class="popover-item">
        <i class="${n.icon}"></i>
        <div>
          <p style="margin: 0; line-height: 1.3;">${n.text}</p>
          <small style="color: #94a3b8;">${n.time}</small>
        </div>
      </div>
    `).join("");
  }

  const msgBadge = document.getElementById("msgBadge");
  const msgContainer = document.getElementById("msgContainer");
  if (msgBadge && msgContainer) {
    msgBadge.textContent = `${messages.length} New`;
    msgContainer.innerHTML = messages.map(m => `
      <div class="popover-item">
        <i class="ri-chat-3-line" style="color: #059669;"></i>
        <div>
          <p style="margin: 0; font-weight: 600; color: #0f172a;">${m.name}</p>
          <p style="margin: 0; line-height: 1.3;">${m.text}</p>
          <small style="color: #94a3b8;">${m.time}</small>
        </div>
      </div>
    `).join("");
  }
}

// 2. Render User's Saved Favorites
function renderDashboardFavorites(favorites) {
  const container = document.getElementById("favoritesContainer");
  if (!container) return;

  if (!favorites || favorites.length === 0) {
    container.innerHTML = `<p style="color: #64748b; padding: 12px;">No favorites saved yet. Browse recipes to bookmark meals.</p>`;
    return;
  }

  container.innerHTML = favorites.map(r => `
    <div class="recipe-card">
      <img src="${r.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=500&q=80'}" alt="${r.title}" class="recipe-img">
      <div class="recipe-body">
        <h3>${r.title}</h3>
        <p class="recipe-meta">⏳ ${r.prepTime} mins • 🍽️ ${r.servings || 2} Servings</p>
        <div class="recipe-actions">
          <a href="/recipe-details?id=${r._id}">View</a>
          <button class="btn-fav-card" onclick="toggleFavoriteDashboard('${r._id}')">💔 Remove</button>
        </div>
      </div>
    </div>
  `).join("");
}

function renderRecentInteractions(recipes, favorites) {
  const container = document.getElementById("activityFeed");
  if (!container) return;

  const activities = [
    ...recipes.map((recipe) => ({
      icon: "ri-restaurant-line",
      text: `You published ${recipe.title}.`,
      date: recipe.createdAt
    })),
    ...favorites.map((recipe) => ({
      icon: "ri-heart-3-line",
      text: `You saved ${recipe.title} to your favorites.`,
      date: recipe.updatedAt || recipe.createdAt
    }))
  ]
    .filter((activity) => activity.date)
    .sort((first, second) => new Date(second.date) - new Date(first.date))
    .slice(0, 5);

  if (activities.length === 0) {
    container.innerHTML = `<p style="color: #64748b; padding: 12px 0;">No recent interactions yet.</p>`;
    return;
  }

  container.innerHTML = activities.map((activity) => `
    <div class="timeline-item">
      <div class="timeline-dot dot-blue"></div>
      <div class="timeline-content">
        <p>${activity.text}</p>
        <span class="time-ago">${new Date(activity.date).toLocaleDateString()}</span>
      </div>
    </div>
  `).join("");
}

// 3. Global Favorite Toggle/Remove Trigger
window.toggleFavoriteDashboard = async (recipeId) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`/api/collections/favorites/toggle/${recipeId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to update favorite");

    // Refresh data
    const updatedFavorites = await API.favorites();
    renderDashboardFavorites(updatedFavorites);
    
    const sidebarFavCount = document.getElementById("sidebarFavCount");
    const kpiBookmarksCount = document.getElementById("kpiBookmarksCount");
    if (sidebarFavCount) sidebarFavCount.textContent = updatedFavorites.length;
    if (kpiBookmarksCount) kpiBookmarksCount.textContent = updatedFavorites.length;
  } catch (err) {
    alert(err.message);
  }
}