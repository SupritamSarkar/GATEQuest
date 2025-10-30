// ======================================================
// 🔐 GateQuest Authentication Logic (Login + Signup + Google OAuth)
// ======================================================

const API_BASE = "https://gatequest.onrender.com/api/v1/auth";

// -----------------------------
// 🌐 DOM Elements
// -----------------------------
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const showSignup = document.getElementById("show-signup");
const showLogin = document.getElementById("show-login");
const messageEl = document.getElementById("message");
const subtitleEl = document.getElementById("form-subtitle");
const googleLoginBtn = document.getElementById("google-login-btn");
const googleSignupBtn = document.getElementById("google-signup-btn");

// -----------------------------
// 🧩 Helper: Show messages
// -----------------------------
function showMessage(msg, type = "") {
  if (!messageEl) return;
  messageEl.textContent = msg;
  messageEl.className = `message ${type}`;
}

// auth.js

// -----------------------------
// 🧠 Handle Google Login Redirect
// -----------------------------
(function handleGoogleRedirect() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const userQuery = params.get("user"); // <-- Get the user query

  if (token && userQuery) {
    // <-- Check for BOTH
    try {
      // 1. Decode the user string
      const userJson = decodeURIComponent(userQuery);

      // 2. ✅ Save BOTH token and user
      localStorage.setItem("token", token);
      localStorage.setItem("user", userJson); // <-- THE FIX

      showMessage("Login successful via Google!", "success");

      // 3. Redirect to the main app
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } catch (e) {
      console.error("Failed to parse user data from URL", e);
      showMessage("Login failed. Please try again.", "error");
    }
  }
})();

// -----------------------------
// 🔘 Google Login Click
// -----------------------------
if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", () => {
    // Redirect to backend Google OAuth route
    window.location.href = `${API_BASE}/google`;
  });
}

if (googleSignupBtn) {
  googleSignupBtn.addEventListener("click", () => {
    window.location.href =
      "https://gatequest.onrender.com/api/v1/auth/google" ||
      "http://localhost:5000/api/v1/auth/google";
  });
}

// -----------------------------
// 🔄 Toggle Forms
// -----------------------------
if (showSignup && showLogin) {
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
}

// -----------------------------
// 🧾 Signup Handler
// -----------------------------
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fullName = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    showMessage("Creating account...");

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
}

// -----------------------------
// 🔑 Login Handler
// -----------------------------
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    showMessage("Logging in...");

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
}
