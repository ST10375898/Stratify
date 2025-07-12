/*=================== firebase setup ======================*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD63RcMGnZSamyTkQKJ-Qj2MNBDXcm8d8I",
  authDomain: "stratify-b096e.firebaseapp.com",
  projectId: "stratify-b096e",
  storageBucket: "stratify-b096e.appspot.com",
  messagingSenderId: "846166364409",
  appId: "1:846166364409:web:51910921262aac71399228"
};

// Initialize Firebase
const application = initializeApp(firebaseConfig);
const auth = getAuth(application);
const db = getFirestore(application);

/*=================== end firebase setup ======================*/

window.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("authModal");
  const loginBtn = document.getElementById("logIn");
  const signUpBtn = document.getElementById("signUp");
  const closeBtn = document.querySelector(".closeBtn");
  const logoutBtn = document.getElementById("logOut");

  const loginForm = document.getElementById("loginForm");
  const signUpForm = document.getElementById("signupForm");

  const emailInput = document.getElementById("signupEmail");
  const passwordInput = document.getElementById("signupPassword");
  const confirmInput = document.getElementById("confirmPassword");
  const usernameInput = document.getElementById("signupUsername");

  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  // Show login modal
  loginBtn?.addEventListener("click", () => {
    modal.style.display = "block";
    loginForm.style.display = "block";
    signUpForm.style.display = "none";
  });

  // Show signup modal
  signUpBtn?.addEventListener("click", () => {
    modal.style.display = "block";
    loginForm.style.display = "none";
    signUpForm.style.display = "block";
  });

  // Close modal
  closeBtn?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Signup form submit
  signUpForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.toLowerCase();
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    const username = usernameInput.value.trim();

    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    // Simple password requirements check (optional)
    if (
      password.length < 10 ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password) ||
      !/[!@#\$%\^&\*]/.test(password)
    ) {
      alert("Password does not meet requirements!");
      return;
    }

    if (!username) {
      alert("Please enter a username");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store extra user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        createdAt: new Date().toISOString(),
      });

      alert("Account created successfully!");
      modal.style.display = "none";

      // Redirect or update UI
      window.location.href = "analysis.html";
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Email is already registered.");
      } else {
        alert("Signup error: " + error.message);
        console.error(error);
      }
    }
  });

  // Login form submit
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginEmail.value.toLowerCase();
    const password = loginPassword.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
      modal.style.display = "none";
      window.location.href = "dashboard.html";
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        alert("Email is not registered.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Click 'Forgot Password' to reset.");
      } else {
        alert("Login error: " + error.message);
      }
    }
  });

  // Forgot password link
  const forgetPasswordLink = document.getElementById("forgetPasswordLink");
  forgetPasswordLink?.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = loginEmail.value.toLowerCase();
    if (!email) {
      alert("Please enter your email to reset password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert(`Password reset link sent to ${email}`);
    } catch (error) {
      alert("Error sending reset email: " + error.message);
      console.error(error);
    }
  });

  // Logout button
  logoutBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    await signOut(auth);
    alert("Logged out!");
    window.location.href = "index.html";
  });

  // Auth state changes UI toggle
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginBtn.style.display = "none";
      signUpBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
    } else {
      logoutBtn.style.display = "none";
      loginBtn.style.display = "inline-block";
      signUpBtn.style.display = "inline-block";
    }
  });

  // Password checklist visual update
  passwordInput?.addEventListener("input", () => {
    const val = passwordInput.value;
    document.getElementById("length").style.color = val.length >= 10 ? "green" : "red";
    document.getElementById("uppercase").style.color = /[A-Z]/.test(val) ? "green" : "red";
    document.getElementById("number").style.color = /\d/.test(val) ? "green" : "red";
    document.getElementById("special").style.color = /[!@#\$%\^&\*]/.test(val) ? "green" : "red";
  });
});
