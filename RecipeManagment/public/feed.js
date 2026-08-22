document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("feedContainer");

  const stream = JSON.parse(localStorage.getItem("activityStream")) || [
    { text: "Chef Antonio published a new recipe: Creamy Garlic Tuscan Pasta", date: "10m ago" },
    { text: "Sarah Jenkins rated Rustic Margherita Pizza 5 Stars ⭐", date: "1h ago" },
    { text: "Chef Michael created the Desserts & Sweets Collection", date: "3h ago" }
  ];

  container.innerHTML = stream.map(item => `
    <div style="display: flex; gap: 14px; padding: 14px 0; border-bottom: 1px solid #f1f5f9; align-items: center;">
      <div style="width: 38px; height: 38px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0;">
        <i class="ri-notification-3-line"></i>
      </div>
      <div>
        <p style="font-size: 0.92rem; color: #1e293b; line-height: 1.4;">${item.text}</p>
        <small style="color: #94a3b8;">${item.date}</small>
      </div>
    </div>
  `).join("");
});