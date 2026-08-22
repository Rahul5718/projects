document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");

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

  // Helper function to clear errors
  const clearError = (input) => {
    const group = input.closest(".input-group");
    const error = group.querySelector(".error-text");

    input.classList.remove("input-error");
    if (error) {
      error.remove();
    }
  };

  // Validation functions
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^[0-9+-\s()]{7,15}$/.test(phone);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let isValid = true;

    // Reset previous errors
    [nameInput, emailInput, phoneInput, passwordInput].forEach(clearError);

    // Name validation
    if (nameInput.value.trim().length < 2) {
      setError(nameInput, "Full name must be at least 2 characters.");
      isValid = false;
    }

    // Email validation
    if (!isValidEmail(emailInput.value.trim())) {
      setError(emailInput, "Please enter a valid email address.");
      isValid = false;
    }

    // Phone validation
    if (!isValidPhone(phoneInput.value.trim())) {
      setError(phoneInput, "Please enter a valid phone number (at least 7 digits).");
      isValid = false;
    }

    // Password validation
    if (passwordInput.value.length < 8) {
      setError(passwordInput, "Password must be at least 8 characters long.");
      isValid = false;
    }

    // On successful validation
    if (isValid) {
      const userData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        password: passwordInput.value,
      };

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Registration failed");

        localStorage.setItem("token", data.token);
        localStorage.setItem("mockUser", JSON.stringify(data));
        window.location.href = "/dashboard";
      } catch (error) {
        alert(error.message);
      }
    }
  });
});