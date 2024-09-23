var users = [
  { email: "user1@example.com", password: "password1" },
  { email: "user2@example.com", password: "password2" }
];

document.querySelector('#signInFormElement').addEventListener('submit', function(event) {
  event.preventDefault();
  signIn();
});

document.querySelector('#signUpFormElement').addEventListener('submit', function(event) {
  event.preventDefault();
  signUp();
});

function signIn() {
  var email = document.getElementById("signInEmail").value;
  var password = document.getElementById("signInPassword").value;

  var authenticatedUser = users.find(function(user) {
    return user.email === email && user.password === password;
  });

  if (authenticatedUser) {
    window.location.href = "homepage.html"; // Redirect on successful sign in
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

function isStrongPassword(password) {
  var regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$");
  return regex.test(password);
}

function togglePasswordVisibility(inputIds) {
  inputIds.forEach(id => {
    var passwordInput = document.getElementById(id);
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

function showAlert(message) {
  const alertMessage = document.getElementById("alertMessage");
  alertMessage.textContent = message;
  const alertBox = document.getElementById("customAlert");
  alertBox.style.display = "block";
  alertBox.style.opacity = 0;

  setTimeout(() => {
    alertBox.style.opacity = 1;
    alertBox.style.transition = "opacity 0.3s ease";
  }, 10);
}

function closeAlert() {
  const alertBox = document.getElementById("customAlert");
  alertBox.style.opacity = 0;

  setTimeout(() => {
    alertBox.style.display = "none";
  }, 300); // Match this with the duration of the opacity transition
}

document.getElementById("signUpEmail").addEventListener('input', function() {
    const message = this.value.includes("@") ? "" : "Please enter a valid email.";
    showAlert(message);
});