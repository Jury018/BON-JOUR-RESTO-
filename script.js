var users = [
  { email: "user1@example.com", password: "password1" },
  { email: "user2@example.com", password: "password2" }
];

function signIn() {
  var email = document.getElementById("signInEmail").value;
  var password = document.getElementById("signInPassword").value;

  var authenticatedUser = users.find(function(user) {
    return user.email === email && user.password === password;
  });

  if (authenticatedUser) {
    window.location.href = "homepage.html"; // Redirect on successful sign in
  } else {
    alert("Invalid email or password. Please try again.");
  }
}

function signUp() {
  var email = document.getElementById("signUpEmail").value;
  var password = document.getElementById("signUpPassword").value;
  var confirmPassword = document.getElementById("confirmPassword").value;

  // Added stronger password validation
  if (!isStrongPassword(password)) {
    alert("Password must be at least 8 characters long, include a number, an uppercase letter, and a lowercase letter.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return;
  }

  var existingUser = users.find(function(user) {
    return user.email === email;
  });

  if (existingUser) {
    alert("Email is already registered. Please sign in or use a different email.");
  } else {
    users.push({ email: email, password: password });
    alert("Sign up successful! Please sign in with your new account.");
    showSignIn(); // Automatically show the sign in form after successful sign up
  }
}

function isStrongPassword(password) {
  var regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$");
  return regex.test(password);
}

function togglePasswordVisibility(inputId) {
  var passwordInput = document.getElementById(inputId);
  if (passwordInput) {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  }
}

function showSignUp() {
  document.getElementById("signInForm").style.display = "none";
  document.getElementById("signUpForm").style.display = "block";
}

function showSignIn() {
  document.getElementById("signUpForm").style.display = "none";
  document.getElementById("signInForm").style.display = "block";
  
     
}

function signIn() {
  var email = document.getElementById("signInEmail").value;
  var password = document.getElementById("signInPassword").value;

  var authenticatedUser = users.find(function(user) {
    return user.email === email && user.password === password;
  });

  if (authenticatedUser) {
    window.location.href = "index.html"; // Redirect on successful sign in
  } else {
    showAlert("Invalid email or password. Please try again.");
  }
}

function signUp() {
  var email = document.getElementById("signUpEmail").value;
  var password = document.getElementById("signUpPassword").value;
  var confirmPassword = document.getElementById("confirmPassword").value;

  if (!isStrongPassword(password)) {
    showAlert("Password must be at least 8 characters long, include a number, an uppercase letter, and a lowercase letter.");
    return;
  }

  if (password !== confirmPassword) {
    showAlert("Passwords do not match. Please try again.");
    return;
  }

  var existingUser = users.find(function(user) {
    return user.email === email;
  });

  if (existingUser) {
    showAlert("Email is already registered. Please sign in or use a different email.");
  } else {
    users.push({ email: email, password: password });
    showAlert("Sign up successful! Please sign in with your new account.");
    showSignIn(); // Automatically show the sign in form after successful sign up
  }
}

function showAlert(message) {
  const alertMessage = document.getElementById("alertMessage");
  alertMessage.textContent = message;
  document.getElementById("customAlert").style.display = "block";
}

function closeAlert() {
  document.getElementById("customAlert").style.display = "none";
}
