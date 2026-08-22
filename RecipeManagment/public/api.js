const API = {
  token() {
    return localStorage.getItem("token");
  },

  async request(path, options = {}) {
    const headers = { 
      "Content-Type": "application/json", 
      ...(options.headers || {}) 
    };
    const token = this.token();
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(path, { ...options, headers });
    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      // Clear token and redirect if expired or unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("mockUser");
      if (!window.location.pathname.includes("login")) {
        window.location.href = "/login";
      }
    }

    if (!response.ok) throw new Error(data.message || "Request failed");
    return data;
  },

  // Auth & Profile
  profile() { 
    return this.request("/api/profile/me"); 
  },

  // Recipes
  recipes(query = "") { 
    return this.request(`/api/recipes${query}`); 
  },
  myRecipes() { 
    return this.request("/api/profile/contributions"); 
  },

  // Favorites
  favorites() { 
    return this.request("/api/profile/favorites"); 
  },
  toggleFavorite(recipeId) {
    return this.request(`/api/collections/favorites/toggle/${recipeId}`, {
      method: "POST"
    });
  },

  // Collections (Note plural: /collections)
  collections() { 
    return this.request("/api/collections"); 
  }
}