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

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      window.location.href = "homepage.html"; // Redirect after successful sign-in
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

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      database.ref('users/' + user.uid).set({
        email: email
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

  strengthMessage.textContent = `Password Strength: ${strengthText}`;
  strengthMessage.style.color = strengthColor;
}

function togglePasswordVisibility(inputIds) {
  inputIds.forEach(id => {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
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
  document.getElementById("customAlert").style.display = "block";
}

function closeAlert() {
  document.getElementById("customAlert").style.display = "none";
}

window.onload = function() {
  showSignIn(); // Show sign-in form by default
};