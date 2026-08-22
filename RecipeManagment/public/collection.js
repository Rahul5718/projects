document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("collectionsGrid");
  const createBtn = document.getElementById("createCollectionBtn");

  async function render() {
    const cols = await API.collections();
    container.innerHTML = cols.map(c => `
      <div class="panel-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h3>📁 ${c.name}</h3>
          <span class="badge badge-diff">${c.recipes.length} Saved</span>
        </div>
        <p style="color: #64748b; font-size: 0.85rem; margin-bottom: 14px;">Custom curated recipe collection.</p>
        <a href="/recipes" style="color: #2563eb; font-weight: 600; font-size: 0.85rem; text-decoration: none;">Browse to add more →</a>
      </div>
    `).join("");
  }

  createBtn.addEventListener("click", async () => {
    const name = prompt("Enter a title for this collection (e.g., Quick Lunches):");
    if (!name || name.trim() === "") return;

    try {
      await API.request("/api/collection", {
        method: "POST",
        body: JSON.stringify({ name: name.trim() })
      });
      render();
    } catch (error) {
      alert(error.message);
    }
  });

  render().catch((error) => alert(error.message));
});