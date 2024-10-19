let cart = [];
let selectedPayment = "";
let previousOrders = []; // Array to hold previous orders

// Function to add items to the cart
function addToCart() {
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const product = document.getElementById("order").value;
    const drinkType = document.getElementById("drinkType").value;
    const drinkSize = document.getElementById("drinkSize").value;
    const quantity = parseInt(document.getElementById("quantity").value, 10);

    if (!validateEmail(email)) {
        showAlert("Please enter a valid email address.");
        return;
    }

    if (!validatePhoneNumber(phone)) {
        showAlert("Please enter a valid phone number.");
        return;
    }

    if (product === "" || quantity <= 0) {
        showAlert("Please select a product and enter a valid quantity.");
        return;
    }

    let price = getPrice(product, drinkSize);
    const total = price * quantity;

    cart.push({ product, drinkType, drinkSize, quantity, total });

    updateCartDisplay();
}

// Function to handle form submission
function submitForm() {
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    if (!validateEmail(email)) {
        showAlert("Please enter a valid email address.");
        return;
    }

    if (!validatePhoneNumber(phone)) {
        showAlert("Please enter a valid 11-digit phone number.");
        return;
    }

    if (cart.length === 0) {
        showAlert("Your cart is empty. Please add items to your cart before submitting.");
        return;
    }

    const total = calculateCartTotal();
    const confirmationText = `You have ordered ${cart.length} items. Your total is ₱${total}.`;
    document.getElementById("confirmationText").textContent = confirmationText;
    document.getElementById("confirmationMessage").style.display = "block";
    
    displayOrderSummary();
    document.getElementById("orderSummary").style.display = "block";
}

// Function to display the order summary
function displayOrderSummary() {
    const orderDetails = document.getElementById("orderDetails");
    orderDetails.innerHTML = ""; // Clear previous details
    
    cart.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.quantity} x ${item.product} with ${item.drinkSize} ${item.drinkType} - ₱${item.total}`;
        orderDetails.appendChild(listItem);
    });

    previousOrders.push([...cart]); // Store the order in previous orders
    updatePreviousOrdersDisplay();
}

// Function to update the display of previous orders
function updatePreviousOrdersDisplay() {
    const previousOrdersList = document.getElementById("previousOrders");
    previousOrdersList.innerHTML = ""; // Clear previous orders
    previousOrders.forEach((order, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Order ${index + 1}: `;
        
        const reorderButton = document.createElement("input");
        reorderButton.type = "button";
        reorderButton.value = "Reorder";
        reorderButton.onclick = () => reorder(index);
        
        listItem.appendChild(reorderButton);
        previousOrdersList.appendChild(listItem);
    });
}

// Function to reorder previous orders
function reorder(orderIndex) {
    const orderToReorder = previousOrders[orderIndex];
    cart = orderToReorder.map(item => ({ ...item }));
    updateCartDisplay();
}

// Function to update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = ""; // Clear current cart items

    cart.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.quantity} x ${item.product} with ${item.drinkSize} ${item.drinkType} - ₱${item.total}`;
        cartItems.appendChild(listItem);
    });

    document.getElementById("cart").style.display = "block";
}

// Function to confirm payment
function confirmPayment() {
    if (!selectedPayment) {
        showAlert("Please select a payment method.");
        return;
    }

    if (selectedPayment === "Cash on Delivery") {
        showAlert("Your payment is confirmed. Wait for the delivery rider to contact you to get your order.");
        resetOrder();
        return;
    }

    // Redirect based on the selected payment method
    switch (selectedPayment) {
        case "GCash":
            window.location.href = "https://m.gcash.com/gcash-login-web/index.html#/"; // Redirect to GCash
            break;
        case "PayPal":
            window.location.href = "https://www.paypal.com/signin?returnUri=https%3A%2F%2Fwww.paypal.com%2Fmyaccount%2Fsummary&state=%3Fintl%3D0"; // Redirect to PayPal
            break;
        case "PayMaya":
            window.location.href = "https://payout.maya.ph/"; // Redirect to PayMaya
            break;
        default:
            showAlert("Invalid payment method selected.");
            return;
    }

    // After redirection, allow users to provide feedback when they return
    resetOrder();
}

// Function to cancel payment
function cancelPayment() {
    showAlert("Your order has been canceled.");
    resetOrder();
}

// Function to reset the order form and cart
function resetOrder() {
    document.getElementById("orderForm").reset();
    document.getElementById("cartItems").innerHTML = "";
    document.getElementById("cart").style.display = "none";
    document.getElementById("confirmationMessage").style.display = "none";
    cart = [];
    selectedPayment = "";
}

// Helper function to get the price of a product with a specific drink size
function getPrice(product, drinkSize) {
    let basePrice;

    switch (product) {
        case "Chicken Meals with Drinks":
            basePrice = 200;
            break;
        case "Chicken Nuggets Meal with Drinks":
            basePrice = 170;
            break;
        case "Chicken Adobo Meals with Drinks":
            basePrice = 220;
            break;
        case "Chicken with Extra Rice and Drinks":
            basePrice = 220;
            break;
        case "Burger with Drinks":
            basePrice = 120;
            break;
        default:
            basePrice = 0;
    }

    switch (drinkSize) {
        case "Medium":
            return basePrice + 30;
        case "Large":
            return basePrice + 45;
        default:
            return basePrice;
    }
}

// Helper function to calculate the total cost of the cart
function calculateCartTotal() {
    return cart.reduce((total, item) => total + item.total, 0);
}

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailRegex.test(email);
}

// Phone number validation function (11-digit numbers)
function validatePhoneNumber(phone) {
    const phoneRegex = /^[0-9]{11}$/;
    return phoneRegex.test(phone);
}

// Function to show custom alert
function showAlert(message) {
    const alertMessage = document.getElementById("alertMessage");
    alertMessage.textContent = message;
    document.getElementById("customAlert").style.display = "block";
}

// Function to close custom alert
function closeAlert() {
    document.getElementById("customAlert").style.display = "none";
}

// Function to submit feedback
function submitFeedback() {
    const feedback = document.getElementById("feedback").value;
    if (feedback) {
        showAlert("Thank you for your feedback!");
        document.getElementById("feedbackForm").reset();
        // You can store or send the feedback as needed
    } else {
        showAlert("Please enter your feedback before submitting.");
    }
}

// Function to update the selected payment method
function updatePaymentMethod() {
    const paymentSelect = document.getElementById("payment");
    selectedPayment = paymentSelect.value;
}

// Ensure this function is triggered when the payment method changes
document.getElementById("payment").addEventListener("change", updatePaymentMethod);

// homepagescript.js

// Firebase configuration (make sure this is YOUR config from the Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyCmQ3twke1IpprDDAE2OgNOWRUR7-VoCAI",
  authDomain: "bon-jour-base.firebaseapp.com",
  // ... the rest of your config ...
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = firebase.auth();

function signOut() {
  auth.signOut().then(() => {
    window.location.href = "index.html"; // Redirect to your sign-in/sign-up page
  }).catch((error) => {
    console.error("Sign out error:", error); // Log any errors to the console
    // Optionally, display an error message to the user with showAlert()
  });
}

// ... your other homepage JavaScript code (addToCart, submitForm, etc.) ... 

