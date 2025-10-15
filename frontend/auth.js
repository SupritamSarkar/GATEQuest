const API_BASE = "https://gatequest.onrender.com/api/v1/auth";


const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const showSignup = document.getElementById("show-signup");
const showLogin = document.getElementById("show-login");
const messageEl = document.getElementById("message");
const subtitleEl = document.getElementById("form-subtitle");

function showMessage(msg, type = "") {
  messageEl.textContent = msg;
  messageEl.className = `message ${type}`;
}

// Toggle forms
showSignup.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.add("hidden");
  signupForm.classList.remove("hidden");
  subtitleEl.textContent = "Create your account";
  showMessage("");
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  signupForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  subtitleEl.textContent = "Login to continue";
  showMessage("");
});

// Signup handler
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fullName = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  showMessage("Creating account...", "");

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Signup failed");

    showMessage("Account created! Redirecting...", "success");
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setTimeout(() => (window.location.href = "index.html"), 1500);
  } catch (err) {
    showMessage(err.message, "error");
  }
});

// Login handler
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  showMessage("Logging in...", "");

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    showMessage("Login successful! Redirecting...", "success");
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setTimeout(() => (window.location.href = "index.html"), 1500);
  } catch (err) {
    showMessage(err.message, "error");
  }
});
