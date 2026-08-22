document.addEventListener("DOMContentLoaded", () => {
  const navContainer = document.getElementById("mainNav");
  if (!navContainer) return;

  // 1. Get logged-in user data
  const user = JSON.parse(localStorage.getItem("mockUser")) || null;
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  // 2. Build Navigation Links
  let navLinksHTML = "";

  if (user) {
    // Links for logged-in users
    navLinksHTML = `
      <div class="nav-links">
        <a href="/dashboard" class="${currentPath === 'dashboard' ? 'active' : ''}">Dashboard</a>
        <a href="/recipes" class="${currentPath === 'recipes' ? 'active' : ''}">Browse</a>
        <a href="/collection" class="${currentPath === 'collection' ? 'active' : ''}">Collections</a>
        <a href="/feed" class="${currentPath === 'feed' ? 'active' : ''}">Feed</a>
        <a href="/profile" class="${currentPath === 'profile' ? 'active' : ''}">Profile</a>
        ${user.role === 'admin' ? `<a href="/admin" class="${currentPath === 'admin' ? 'active' : ''}" style="color: #ef4444;">Admin</a>` : ''}
        <a href="/add-recipe" class="btn-add ${currentPath === 'add-recipe' ? 'active' : ''}">+ Add Recipe</a>
        <button id="globalLogoutBtn" class="btn-danger-outline" style="padding: 6px 10px; cursor: pointer;">Sign Out</button>
      </div>
    `;
  } else {
    // Links for guests / logged-out users
    navLinksHTML = `
      <div class="nav-links">
        <a href="/recipes" class="${currentPath === 'recipes' ? 'active' : ''}">Browse</a>
        <a href="/login" class="${currentPath === 'login' ? 'active' : ''}">Login</a>
        <a href="/register" class="btn-add">Sign Up</a>
      </div>
    `;
  }

  // 3. Inject Navbar Structure
  navContainer.className = "navbar";
  navContainer.innerHTML = `
    <a href="${user ? '/dashboard' : '/index'}" class="nav-brand">RecipeHub</a>
    ${navLinksHTML}
  `;

  // 4. Attach Logout Handler
  const logoutBtn = document.getElementById("globalLogoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("mockUser");
      localStorage.removeItem("token");
      window.location.href = "/login";
    });
  }
});