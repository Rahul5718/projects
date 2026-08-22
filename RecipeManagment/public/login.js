document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  const email = document.getElementById("email");
  const password = document.getElementById("password");

  // Helper function to show errors
  const setError = (input, message) => {
    const group = input.closest(".input-group");
    let error = group.querySelector(".error-text");

    if (!error) {
      error = document.createElement("small");
      error.className = "error-text";
      group.appendChild(error);
    }

    input.classList.add("input-error");
    error.textContent = message;
  };

  // Clear error
  const clearError = (input) => {
    const group = input.closest(".input-group");
    const error = group.querySelector(".error-text");

    input.classList.remove("input-error");
    if (error) {
      error.remove();
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let isValid = true;

    [email, password].forEach(clearError);

    // Email validation
    if (!isValidEmail(email.value.trim())) {
      setError(email, "Please enter a valid email address.");
      isValid = false;
    }

    // Password empty check
    if (!password.value) {
      setError(password, "Please enter your password.");
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.value.trim(), password: password.value })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Invalid email or password");

        localStorage.setItem("token", data.token);
        localStorage.setItem("mockUser", JSON.stringify(data));
        window.location.href = "/dashboard";
      } catch (error) {
        alert(error.message);
      }
    }
  });
});