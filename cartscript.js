// JavaScript for hamburger menu
// ... (Your existing hamburger menu script) ...

// Get cart data from local storage 
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
  // ... (Your existing updateCart function) ...
}

// Call updateCart() to initially populate the cart
updateCart();

function checkCartAndRedirect() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length > 0) {
    // Redirect to the cart page 
    window.location.href = 'cart.html';
  } else {
    showCustomAlert("Your cart is empty. Please add items to your order first.", 'warning');
  }
}

function showCustomAlert(message, type) {
  // ... (Your existing showCustomAlert function) ...
}

function proceedToCheckout() {
  // Redirect to the order form page
  window.location.href = 'orderform.html';
}
