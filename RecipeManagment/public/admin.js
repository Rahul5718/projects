document.addEventListener("DOMContentLoaded", () => {
  // Initialize mock users if not present
  let users = JSON.parse(localStorage.getItem("allUsers")) || [
    { id: 1, name: "Jane Doe", email: "jane@example.com", status: "Active" },
    { id: 2, name: "SpamBot99", email: "bot@spam.com", status: "Active" },
    { id: 3, name: "Chef Antonio", email: "antonio@kitchen.com", status: "Active" }
  ];

  let recipes = JSON.parse(localStorage.getItem("userRecipes")) || [
    { id: 1001, title: "Creamy Garlic Tuscan Pasta", authorName: "Chef Antonio", category: "Dinner" },
    { id: 1003, title: "Rustic Margherita Pizza", authorName: "Jane Doe", category: "Dinner" }
  ];

  function render() {
    // 1. Render Users
    document.getElementById("userRows").innerHTML = users.map(u => `
      <tr>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td><span class="badge ${u.status === 'Active' ? 'badge-diet' : 'diff-hard'}">${u.status}</span></td>
        <td>
          <button class="btn-danger-outline" onclick="toggleBan(${u.id})">
            ${u.status === 'Active' ? 'Ban User' : 'Unban'}
          </button>
        </td>
      </tr>
    `).join("");

    // 2. Render Recipes
    document.getElementById("recipeRows").innerHTML = recipes.map(r => `
      <tr>
        <td><strong>${r.title}</strong></td>
        <td>${r.authorName}</td>
        <td>${r.category}</td>
        <td>
          <button class="btn-danger-outline" onclick="deleteRecipeAdmin(${r.id})">Remove Post</button>
        </td>
      </tr>
    `).join("");
  }

  // Global functions attached to window for HTML inline calls
  window.toggleBan = (id) => {
    users = users.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Banned" : "Active" } : u);
    localStorage.setItem("allUsers", JSON.stringify(users));
    render();
  };

  window.deleteRecipeAdmin = (id) => {
    if (!confirm("Are you sure you want to delete this recipe permanently?")) return;
    recipes = recipes.filter(r => r.id !== id);
    localStorage.setItem("userRecipes", JSON.stringify(recipes));
    render();
  };

  render();
});