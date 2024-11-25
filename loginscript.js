// Firebase configuration
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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Event Listeners
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

  if (!isValidEmail(email)) {
    displayAlert("Please enter a valid email address.");
    return;
  }

  auth.signInWithEmailAndPassword(email, password);
 
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
}

function signIn() {
  const email = document.getElementById("signInEmail").value;
  const password = document.getElementById("signInPassword").value;

  if (!isValidEmail(email)) {
    displayAlert("Please enter a valid email address.");
    return;
  }
 
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

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      database.ref('users/' + user.uid).set({
        email: email
      });
      // Send verification email
      user.sendEmailVerification().then(() => {
        displayAlert("Sign up successful! Please verify your email before signing in.");
      });
      showSignIn();
    })
    .catch((error) => {
      displayAlert(`Error creating user: ${error.message}`);
    });
}

function sendPasswordResetEmail() {
  const email = document.getElementById("signInEmail").value;

  if (email) {
    auth.sendPasswordResetEmail(email)
      .then(() => {
        displayAlert("Reset password email has been sent to your email address.");
      })
      .catch((error) => {
        displayAlert(`Error sending reset email: ${error.message}`);
      });
  } else {
    displayAlert("Please enter your email address to reset your password.");
  }
}

function isStrongPassword(password) {
  const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$");
  return regex.test(password);
}

function checkPasswordStrength(password) {
  const strengthMessage = document.getElementById('passwordStrengthMessage');
  let strengthText = '';
  let strengthColor = '';

  if (password.length < 8) {
    strengthText = 'Weak';
    strengthColor = 'red';
  } else if (password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) {
    strengthText = 'Strong';
    strengthColor = 'green';
  } else {
    strengthText = 'Moderate';
    strengthColor = 'yellow';
  }

  strengthMessage.textContent = strengthText;
  strengthMessage.style.color = strengthColor;
}

function togglePasswordVisibility(passwordFields) {
  passwordFields.forEach(fieldId => {
    const passwordField = document.getElementById(fieldId);
    if (passwordField.type === "password") {
      passwordField.type = "text";
    } else {
      passwordField.type = "password";
    }
  });
}

function displayAlert(message) {
  const alertMessage = document.getElementById("alertMessage");
  const customAlert = document.getElementById("customAlert");
  alertMessage.textContent = message;
  customAlert.style.display = "block";
}

function closeAlert() {
  const customAlert = document.getElementById("customAlert");
  customAlert.style.display = "none";
}

function showSignUp() {
  const signInForm = document.getElementById("signInForm");
  const signUpForm = document.getElementById("signUpForm");

  signInForm.style.opacity = 1; // Set initial opacity for fade-out
  signInForm.style.transition = "opacity 0.5s"; // Transition effect for fade-out

  signInForm.style.opacity = 0; // Start fade-out

  // Wait for the fade-out to complete before showing the sign-up form
  setTimeout(() => {
    signInForm.style.display = "none"; // Hide sign-in form
    signUpForm.style.display = "block"; // Show sign-up form
    signUpForm.style.opacity = 0; // Set initial opacity for fade-in
    signUpForm.style.transition = "opacity 0.5s"; // Transition effect for fade-in
    signUpForm.style.opacity = 1; // Start fade-in
  }, 500); // Delay matches the fade-out duration
}

function showSignIn() {
  const signInForm = document.getElementById("signInForm");
  const signUpForm = document.getElementById("signUpForm");

  signUpForm.style.opacity = 1; // Set initial opacity for fade-out
  signUpForm.style.transition = "opacity 0.5s"; // Transition effect for fade-out

  signUpForm.style.opacity = 0; // Start fade-out

  // Wait for the fade-out to complete before showing the sign-in form
  setTimeout(() => {
    signUpForm.style.display = "none"; // Hide sign-up form
    signInForm.style.display = "block"; // Show sign-in form
    signInForm.style.opacity = 0; // Set initial opacity for fade-in
    signInForm.style.transition = "opacity 0.5s"; // Transition effect for fade-in
    signInForm.style.opacity = 1; // Start fade-in
  }, 500); // Delay matches the fade-out duration
}

function signOut() {
  auth.signOut()
    .then(() => {
      // Redirect to sign-in page or update the UI
      window.location.href = "index.html"; // Change to your sign-in page URL
    })
    .catch((error) => {
      displayAlert(`Error signing out: ${error.message}`);
    });
}