import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmQ3twke1IpprDDAE2OgNOWRUR7-VoCAI",
  authDomain: "bon-jour-base.firebaseapp.com",
  databaseURL: "https://bon-jour-base-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bon-jour-base",
  storageBucket: "bon-jour-base.appspot.com",
  messagingSenderId: "357223269073",
  appId: "1:357223269073:web:f6cc1488822894c4917bf0",
  measurementId: "G-0049SLDRM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

document.querySelector('#signInFormElement').addEventListener('submit', function(event) {
  event.preventDefault();
  signIn();
});

document.querySelector('#signUpFormElement').addEventListener('submit', function(event) {
  event.preventDefault();
  signUp();
});

function signIn() {
  const email = document.getElementById("signInEmail").value;
  const password = document.getElementById("signInPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // Redirect on successful sign in
      window.location.href = "homepage.html"; 
    })
    .catch((error) => {
      displayAlert(`Error signing in: ${error.message}`);
    });
}

function signUp() {
  const email = document.getElementById("signUpEmail").value;
  const password = document.getElementById("signUpPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!isStrongPassword(password)) {
    displayAlert("Password must be at least 8 characters long, include a number, an uppercase letter, and a lowercase letter.");
    return;
  }

  if (password !== confirmPassword) {
    displayAlert("Passwords do not match. Please try again.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;

      // Store additional user information in the Realtime Database
      const usersRef = ref(database, 'users/' + user.uid);
      set(usersRef, {
        email: email,
        // ... other user data ...
      });

      displayAlert("Sign up successful! Please sign in with your new account.");
      showSignIn();
    })
    .catch((error) => {
      displayAlert(`Error creating user: ${error.message}`);
    });
}

function isStrongPassword(password) {
  const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$");
  return regex.test(password);
}

function togglePasswordVisibility(inputIds) {
  inputIds.forEach(id => {
    const passwordInput = document.getElementById(id);
    if (passwordInput) {
      passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    }
  });
}

function showSignUp() {
  document.getElementById("signInForm").style.display = "none";
  document.getElementById("signUpForm").style.display = "block";
}

function showSignIn() {
  document.getElementById("signUpForm").style.display = "none";
  document.getElementById("signInForm").style.display = "block";
}

function displayAlert(message) {
  const alertMessage = document.getElementById("alertMessage");
  alertMessage.textContent = message;
  const alertBox = document.getElementById("customAlert");
  alertBox.style.display = "block"; 
}

function closeAlert() {
  const alertBox = document.getElementById("customAlert");
  alertBox.style.display = "none"; 
}

// Call showSignIn on page load to ensure the sign-in form is shown first
window.onload = function() {
  showSignIn(); 
};

function signOut() {
  auth.signOut()
    .then(() => {
      // Sign-out successful.
      // Show the sign-in form again or redirect to a sign-in page
      showSignIn(); // Or: window.location.href = "signin.html";
    })
    .catch((error) => {
      // An error happened.
      displayAlert(`Error signing out: ${error.message}`);
    });
}
