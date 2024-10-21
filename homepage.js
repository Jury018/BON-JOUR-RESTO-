let cart = [];
let selectedPayment = "";
let previousOrders = []; 

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
    document.getElementById("totalAmount").textContent = total; // Update total amount
}

function displayOrderSummary() {
    const orderDetails = document.getElementById("orderDetails");
    orderDetails.innerHTML = ""; 
    
    cart.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.quantity} x ${item.product} with ${item.drinkSize} ${item.drinkType} - ₱${item.total}`;
        orderDetails.appendChild(listItem);
    });

    previousOrders.push([...cart]); 
    updatePreviousOrdersDisplay();
}

function updatePreviousOrdersDisplay() {
    const previousOrdersList = document.getElementById("previousOrders");
    previousOrdersList.innerHTML = ""; 
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

function reorder(orderIndex) {
    const orderToReorder = previousOrders[orderIndex];
    cart = orderToReorder.map(item => ({ ...item }));
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById("cartItems");
    cartItems.innerHTML = ""; 

    cart.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.quantity} x ${item.product} with ${item.drinkSize} ${item.drinkType} - ₱${item.total}`;
        cartItems.appendChild(listItem);
    });

    document.getElementById("cart").style.display = "block";
}

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

    switch (selectedPayment) {
        case "GCash":
            window.location.href = "https://m.gcash.com/gcash-login-web/index.html#/"; 
            break;
        case "PayPal":
            window.location.href = "https://www.paypal.com/signin?returnUri=https%3A%2F%2Fwww.paypal.com%2Fmyaccount%2Fsummary&state=%3Fintl%3D0"; 
            break;
        case "PayMaya":
            window.location.href = "https://payout.maya.ph/"; 
            break;
        default:
            showAlert("Invalid payment method selected.");
            return;
    }

    resetOrder();
}

function cancelPayment() {
    showAlert("Your order has been canceled.");
    resetOrder();
}

function resetOrder() {
    document.getElementById("orderForm").reset();
    document.getElementById("cartItems").innerHTML = "";
    document.getElementById("cart").style.display = "none";
    document.getElementById("confirmationMessage").style.display = "none";
    document.getElementById("orderSummary").style.display = "none"; // Hide order summary
    cart = [];
    selectedPayment = "";
}

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

function calculateCartTotal() {
    return cart.reduce((total, item) => total + item.total, 0);
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailRegex.test(email);
}

function validatePhoneNumber(phone) {
    const phoneRegex = /^[0-9]{11}$/;
    return phoneRegex.test(phone);
}

function showAlert(message) {
    const alertMessage = document.getElementById("alertMessage");
    alertMessage.textContent = message;
    document.getElementById("customAlert").style.display = "block";
}

function closeAlert() {
    document.getElementById("customAlert").style.display = "none";
}

function submitFeedback() {
    const feedback = document.getElementById("feedback").value;
    if (feedback) {
        showAlert("Thank you for your feedback!");
        document.getElementById("feedbackForm").reset();
    } else {
        showAlert("Please enter your feedback before submitting.");
    }
}

function updatePaymentMethod() {
    const paymentSelect = document.getElementById("payment");
    selectedPayment = paymentSelect.value;
}

document.getElementById("payment").addEventListener("change", updatePaymentMethod);

document.getElementById("orderButton").addEventListener("click", function() {
  // Redirect to your ordering system page (replace with your actual URL)
  window.location.href = "ordering_system.html"; 
});


