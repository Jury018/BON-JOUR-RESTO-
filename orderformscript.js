// JavaScript for hamburger menu
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav-list');

hamburger.addEventListener('click', () => {
  navList.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Get cart data from local storage and populate the order textarea
const orderTextarea = document.getElementById('order');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateOrderSummary() {
  let orderText = "";
  let total = 0;
  const orderSummaryItems = document.getElementById('order-summary-items');
  const orderSummaryTotal = document.getElementById('order-summary-total');
  orderSummaryItems.innerHTML = ''; // Clear the order summary

  cart.forEach((item, index) => {
    orderText += `${item.name} - ${item.price}\n`;
    total += parseFloat(item.price.replace('₱', ''));

    // Add item to order summary with remove button
    let li = document.createElement('li');
    li.innerHTML = `${item.name} - ${item.price} <button class="remove-item" data-index="${index}">x</button>`;
    orderSummaryItems.appendChild(li);
  });

  orderTextarea.value = orderText;
  orderSummaryTotal.textContent = '₱' + total.toFixed(2);

  // Add event listeners to remove buttons
  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const indexToRemove = button.dataset.index;
      cart.splice(indexToRemove, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateOrderSummary();
    });
  });
}

if (cart.length > 0) {
  updateOrderSummary();
}

function checkCartAndRedirect() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length > 0) {
    window.location.href = 'orderform.html';
  } else {
    showCustomAlert("Your cart is empty. Please add items to your order first.", 'warning');
  }
}

function showCustomAlert(message, type) {
  const alertContainer = document.createElement('div');
  alertContainer.classList.add('alert'); // Add a CSS class for styling

  // Set alert type (e.g., success, warning, error)
  switch (type) {
    case 'success':
      alertContainer.classList.add('alert-success');
      break;
    case 'warning':
      alertContainer.classList.add('alert-warning');
      break;
    case 'error':
      alertContainer.classList.add('alert-danger');
      break;
  }

  alertContainer.textContent = message;

  // Add a close button (optional)
  const closeButton = document.createElement('button');
  closeButton.textContent = 'x';
  closeButton.classList.add('close');
  closeButton.addEventListener('click', () => {
    alertContainer.remove();
  });
  alertContainer.appendChild(closeButton);

  // Append the alert to the body or a specific container
  document.body.appendChild(alertContainer);
}

// Function to validate the email before form submission
function validateEmail(event, storedEmail) { // Added storedEmail as an argument
  const orderEmail = document.getElementById('email').value;

  if (storedEmail && orderEmail !== storedEmail) {
    event.preventDefault(); // Prevent form submission
    showCustomAlert("Email addresses do not match. Please enter the email you used to sign in.", 'warning');
  }
}

// Function to validate phone number format
function validatePhoneNumber(event) {
  const phoneNumber = document.getElementById('phone').value;

  // Check if the phone number is 11 digits and contains only numbers
  if (!/^\d{11}$/.test(phoneNumber)) {
    event.preventDefault(); // Prevent form submission
    showCustomAlert("Invalid phone number format. Please enter an 11-digit number.", 'warning');
  }
}

// Function to validate payment method selection
function validatePaymentMethod(event) {
  const paymentMethod = document.getElementById('payment').value;

  if (paymentMethod === '') {
    event.preventDefault(); // Prevent form submission
    showCustomAlert("Please select a payment method.", 'warning');
  }
}

// Function to handle form submission
function handleFormSubmission(event, storedEmail) { // Added storedEmail as an argument
  event.preventDefault(); // Prevent default form submission

  // Validate email, phone number, and payment method
  validateEmail(event, storedEmail); // Pass storedEmail to validateEmail
  validatePhoneNumber(event);
  validatePaymentMethod(event);

  // If validation passes, proceed with order processing
  if (!event.defaultPrevented) {
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const orderDetails = document.getElementById('order').value;
    const paymentMethod = document.getElementById('payment').value;

    // Create a Firestore document with the order data
    const ordersCollection = collection(db, "orders");
    addDoc(ordersCollection, {
      name,
      email,
      phone,
      address,
      orderDetails,
      paymentMethod,
      createdAt: new Date().toISOString()
    })
      .then((docRef) => {
        // Order placed successfully
        showCustomAlert("Order placed successfully! Your order ID is: " + docRef.id, 'success');

        // Clear form data and cart
        document.getElementById('orderForm').reset();
        localStorage.removeItem('cart');
        updateOrderSummary();

        // Redirect to Gcash or PayPal if selected
        if (paymentMethod === 'gcash') {
          window.location.href = 'https://www.gcash.com/'; // Replace with actual Gcash URL
        } else if (paymentMethod === 'paymaya') {
          window.location.href = 'https://www.paymaya.com/'; // Replace with actual PayMaya URL
        }
      })
      .catch((error) => {
        // Error occurred while placing the order
        console.error("Error placing order:", error);
        showCustomAlert("An error occurred while placing your order. Please try again later.", 'error');
      });
  }
}

// Attach event listeners to form fields and submit button
document.getElementById('orderForm').addEventListener('input', saveFormData);
// Modified event listener to include Firebase email retrieval
document.getElementById('orderForm').addEventListener('submit', (event) => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const usersRef = firebase.database().ref('users/' + user.uid);

      usersRef.once('value').then(snapshot => {
        const storedEmail = snapshot.val().email;
        handleFormSubmission(event, storedEmail); // Pass storedEmail to handleFormSubmission
      });
    } else {
      console.error("User is not signed in.");
      // Consider redirecting to sign-in page
      // window.location.href = "index.html";
    }
  });
});

document.addEventListener('DOMContentLoaded', loadFormData);

// Function to save form data to localStorage
function saveFormData() {
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    order: document.getElementById('order').value,
    payment: document.getElementById('payment').value,
  };
  localStorage.setItem('orderFormData', JSON.stringify(formData));
}

// Function to load form data from localStorage
function loadFormData() {
  const savedData = JSON.parse(localStorage.getItem('orderFormData'));
  if (savedData) {
    document.getElementById('name').value = savedData.name || '';
    document.getElementById('email').value = savedData.email || '';
    document.getElementById('phone').value = savedData.phone || '';
    document.getElementById('address').value = savedData.address || '';
    document.getElementById('order').value = savedData.order || '';
    document.getElementById('payment').value = savedData.payment || 'gcash'; // Default payment option
  }
}

// Firebase configuration (make sure to replace with your actual configuration)
const firebaseConfig = {
  // ... your Firebase config ...
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize Firestore (if you are using Firestore)
const db = firebase.firestore();
