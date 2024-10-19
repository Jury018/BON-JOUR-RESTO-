const users = []; // Initialize an empty array for users

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

  // **IMPORTANT:** In a real application, you would authenticate against a server here
  // For this example, we'll simulate authentication with the stored users array
  const authenticatedUser = users.find(user => user.email === email && user.password === password);

  if (authenticatedUser) {
    // Redirect on successful sign in
    window.location.href = "homepage.html"; 
  } else {
    displayAlert("Invalid email or password. Please try again.");
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

  const existingUser = users.find(user => user.email === email);

  if (existingUser) {
    displayAlert("Email is already registered. Please sign in or use a different email.");
  } else {
    // **IMPORTANT:** In a real application, you would send this data to a server to be stored securely
    users.push({ email: email, password: password }); 
    displayAlert("Sign up successful! Please sign in with your new account.");
    showSignIn(); 
  }
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
window.
