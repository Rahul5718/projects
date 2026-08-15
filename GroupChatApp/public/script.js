// 1. HANDLES LOGIN FORM SUBMISSION


async function handleLogin(event) {
  event.preventDefault(); // Stop page from refreshing

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3000/chatbord/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    });

    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();

      if (response.ok && data.success) {
        // 1. Commit session configurations to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        
        // 2. FIX: Store userName from backend instead of raw email
        if (data.name) {
          localStorage.setItem("userName", data.name);
        } else {
          localStorage.setItem("userName", "Chat User"); // Fallback
        }

        alert(`Login Successful! Welcome ${data.role || 'user'}.`);

        // DYNAMIC REDIRECT BASED ON ROLE
        if (data.role === "admin") {
          window.location.href = "/admin"; 
        } else {
          window.location.href = "/userChat"; 
        }
        return;
      } else {
        // Captures clean error objects from your backend response
        alert(data.message || "Invalid email credentials or password.");
      }
    } else {
      // Handles rare instances where your server might crash and throw raw HTML text instead of JSON
      const fallbackText = await response.text();
      alert(`Server error (${response.status}): ${fallbackText || response.statusText}`);
    }

  } catch (error) {
    console.error("Login Error:", error);
    alert("Could not connect to the authentication server. Verify your internet link.");
  }
}
// 2. HANDLES SIGNUP FORM SUBMISSION

async function handleSignup(event) {
  event.preventDefault();
  const formElement = event.target

  // Make sure these IDs match your signup HTML input elements
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone =
    document.getElementById("phn").value ||
    document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  const payload = {
    name,
    email,
    phone,
    password,
  };

  try {
    const response = await fetch("http://localhost:3000/chatbord/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    // localStorage.setItem("userName",name)

    console.log(response.status)
   
     const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if ( response.ok || data.success === true || data.success ==="true") {
          alert("Registration complete! You can now log in.");
          formElement.reset()
          window.location.href = "/login"; // Send them to login page
          return
      }
      else if(response.status ===409){
        alert(data.message || 'email already registerd')
        return
      }
      else{
        alert('registration failed')
        return 
      }
    }
    else if (response.ok) {
      alert("Registration complete! You can now log in.");
      window.location.href = "/login";
      return
    }
    else {
        const errorText = await response.text();
        alert(`Registration failed: ${errorText || response.statusText}`);
    }
  } catch (error) {
    console.error("Signup Error:", error);
    alert("Could not connect to the server.");
  }
}

async function handleLogout() {
  try {
    await fetch("http://localhost:3000/chatbord/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (err) {
    console.error("Failed to log timing on server", err);
  }

  // Clear everything and go back to login page
  localStorage.clear();
  window.location.href = "/login";
}


document.addEventListener('DOMContentLoaded', () => {
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const messageBox = document.getElementById('messageBox');

      try {
        const response = await axios.post('/password/forgotpassword', { email });
        const msg = response.data.message || response.data.error || 'Request processed.';
        messageBox.innerHTML = `<p style="color: #d1f7e0;">${msg}</p>`;
      } catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error || 'Error sending email. Please try again.';
        messageBox.innerHTML = `<p style="color: #ffb4b4;">${msg}</p>`;
      }
    });
  }
});