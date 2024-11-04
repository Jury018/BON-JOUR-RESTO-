const cardDetailsDiv = document.getElementById('cardDetails');
const paymentRadios = document.querySelectorAll('input[name="pay"]');
const amountInput = document.getElementById('totalAmount');
const payNowButton = document.getElementById('payNowButton');

// Get the total amount from the cart
const cart = JSON.parse(localStorage.getItem('cart')) || [];
let totalAmount = 0;
cart.forEach(item => {
  totalAmount += parseFloat(item.price.replace('₱', '').replace(',', '')) * (item.quantity || 1);
});
amountInput.value = totalAmount;
amountInput.readOnly = true;

// Show/hide card details based on payment method selection
paymentRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.id === 'bc1') {
      cardDetailsDiv.style.visibility = 'visible';
      cardDetailsDiv.style.position = 'static';
    } else {
      cardDetailsDiv.style.visibility = 'hidden';
      cardDetailsDiv.style.position = 'absolute';
    }
  });
});

// Disable "PAY NOW" button initially
payNowButton.disabled = true;

// Function to check if all fields are filled
function checkFormValidity() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;

  if (firstName && lastName && phoneNumber && address && city) {
    payNowButton.disabled = false;
  } else {
    payNowButton.disabled = true;
  }
}

// Add event listeners to all input fields to check validity on input
const inputFields = document.querySelectorAll('.name');
inputFields.forEach(input => {
  input.addEventListener('input', checkFormValidity);
});

// Function to validate the card number using Luhn's algorithm
function checkLuhn(cardNo) {
  let nDigits = cardNo.length;
  let nSum = 0;
  let isSecond = false;
  for (let i = nDigits - 1; i >= 0; i--) {
    let d = cardNo[i].charCodeAt() - '0'.charCodeAt();
    if (isSecond == true)
      d = d * 2;
    nSum += parseInt(d / 10, 10);
    nSum += d % 10;
    isSecond = !isSecond;
  }
  return (nSum % 10 == 0);
}

// Add event listeners for real-time validation and accessibility
const formFields = {
  firstName: { input: document.getElementById('firstName'), error: document.getElementById('firstNameError') },
  lastName: { input: document.getElementById('lastName'), error: document.getElementById('lastNameError') },
  phoneNumber: { input: document.getElementById('phoneNumber'), error: document.getElementById('phoneNumberError') },
  address: { input: document.getElementById('address'), error: document.getElementById('addressError') },
  city: { input: document.getElementById('city'), error: document.getElementById('cityError') },
  cardNumber: { input: document.getElementById('cardNumber'), error: document.getElementById('cardNumberError') },
  cardCVC: { input: document.getElementById('cardCVC'), error: document.getElementById('cardCVCError') },
  expMonth: { input: document.getElementById('expMonth'), error: document.getElementById('expMonthError') },
  expYear: { input: document.getElementById('expYear'), error: document.getElementById('expYearError') }
};

for (const field in formFields) {
  formFields[field].input.addEventListener('input', () => {
    let isValid = true;
    let errorMessage = '';

    switch (field) {
      case 'firstName':
      case 'lastName':
      case 'address':
      case 'city':
        isValid = formFields[field].input.value !== '';
        errorMessage = isValid ? '' : `${field.replace(/([A-Z])/g, ' $1').trim()} is required`;
        break;
      case 'phoneNumber':
        isValid = /^(9|09|\+639)\d{9}$/.test(formFields[field].input.value); // Updated regex
        errorMessage = isValid ? '' : 'Invalid phone number format';
        break;
      case 'cardNumber':
        isValid = checkLuhn(formFields[field].input.value.replace(/\D/g, '')); // Remove non-digits before validation
        errorMessage = isValid ? '' : 'Invalid card number';
        break;
      case 'cardCVC':
        isValid = formFields[field].input.value.length >= 3 && formFields[field].input.value.length <= 4;
        errorMessage = isValid ? '' : 'Invalid CVC';
        break;
      case 'expMonth':
        const month = parseInt(formFields[field].input.value);
        isValid = !isNaN(month) && month >= 1 && month <= 12;
        errorMessage = isValid ? '' : 'Invalid month';
        break;
      case 'expYear':
        const year = parseInt(formFields[field].input.value);
        const currentYear = new Date().getFullYear();
        isValid = !isNaN(year) && year >= currentYear;
        errorMessage = isValid ? '' : 'Invalid year';
        break;
    }

    formFields[field].error.textContent = errorMessage;
    formFields[field].input.setAttribute('aria-invalid', !isValid);

    // Disable pay now button if any field is invalid
    payNowButton.disabled = !isValid; 
  });
}

// Add loading indicator functionality
const loadingIndicator = document.getElementById('loadingIndicator');

// Function to display the custom alert message
function displayAlert(message) {
  // Create the alert container element
  const alertContainer = document.createElement('div');
  alertContainer.classList.add('custom-alert'); 

  // Create the message paragraph
  const messageElement = document.createElement('p');
  messageElement.textContent = message;

  // Create the close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.addEventListener('click', () => {
    document.body.removeChild(alertContainer); // Remove the alert from the DOM
  });

  // Add the message and button to the container
  alertContainer.appendChild(messageElement);
  alertContainer.appendChild(closeButton);

  // Add the alert container to the page
  document.body.appendChild(alertContainer); 

  // Auto-close the alert after 2 seconds
  setTimeout(() => {
    if (alertContainer.parentNode === document.body) {
      document.body.removeChild(alertContainer); // Remove the alert from the DOM
    }
  }, 2000);
}

// Handle "PAY NOW" button click
payNowButton.addEventListener('click', (event) => {
  let selectedPayment = document.querySelector('input[name="pay"]:checked').id;

  // Form validation
  let isValid = true;

  // Check if all required fields are filled
  const requiredFields = ['firstName', 'lastName', 'phoneNumber', 'address', 'city'];
  requiredFields.forEach(field => {
    const fieldValue = document.getElementById(field).value.trim();
    if (fieldValue === "") {
      isValid = false; 
      displayAlert("Please fill in all required fields before proceeding."); 
      return; 
    }
  });

  // Additional validation for card details if credit card is selected
  if (selectedPayment === 'bc1') {
    const cardFields = ['cardNumber', 'cardCVC', 'expMonth', 'expYear'];
    cardFields.forEach(field => {
      const fieldValue = document.getElementById(field).value.trim();
      if (fieldValue === "") {
        isValid = false;
        displayAlert("Please fill in all required card details."); 
        return; 
      }
    });
  }

  if (isValid) {
    // Check if totalAmount is valid
    if (totalAmount > 0) {
      // Prevent default confirmation dialog
      event.preventDefault(); 

      // Show custom confirmation alert
      displayConfirmationAlert("Are you sure you want to proceed with the payment?", () => {
        // User clicked "Confirm" - Proceed with payment

        // Estimate internet speed (replace with actual speed test if needed)
        const estimatedSpeed = navigator.connection ? navigator.connection.downlink : 10; // Default to 10 Mbps if not available
        const loadingTime = estimatedSpeed > 5 ? 5000 : (estimatedSpeed > 2 ? 10000 : 20000); // Adjust loading time based on speed
        loadingIndicator.style.display = 'block'; 

        setTimeout(() => {
          // Hide loading indicator
          loadingIndicator.style.display = 'none';

          // Handle online payment methods (redirect directly to rating.html)
          if (selectedPayment === 'bc2' || selectedPayment === 'bc3' || selectedPayment === 'bc4' || selectedPayment === 'bc6') {
            window.location.href = 'rating.html';
          } else {
            // Handle Cash on Delivery (bc5) and Credit Card (bc1) - Redirect after a small delay
            setTimeout(() => {
              window.location.href = 'rating.html';
            }, 500); // Small delay for user to see the success message
          }

          // Clear the form fields
          document.getElementById('firstName').value = '';
          document.getElementById('lastName').value = '';
          document.getElementById('phoneNumber').value = '';
          document.getElementById('address').value = '';
          document.getElementById('city').value = '';
          document.getElementById('cardNumber').value = '';
          document.getElementById('cardCVC').value = '';
          document.getElementById('expMonth').value = '';
          document.getElementById('expYear').value = '';

          // Reset local storage (remove the cart items)
          localStorage.removeItem('cart');

        }, loadingTime); // Use the dynamic loading time
      }); 
    } else {
      displayAlert("There is no total amount to pay. Please add items to your cart.");
    }
  } 
});

// Function to display the custom confirmation alert
function displayConfirmationAlert(message, onConfirm) {
  const alertContainer = document.createElement('div');
  alertContainer.classList.add('custom-alert');

  const messageElement = document.createElement('p');
  messageElement.textContent = message;

  const confirmButton = document.createElement('button');
  confirmButton.textContent = 'Confirm';
  confirmButton.addEventListener('click', () => {
    document.body.removeChild(alertContainer);
    onConfirm(); // Execute the callback function
  });

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(alertContainer);
    // You can add a message here saying the payment was canceled
  });

  alertContainer.appendChild(messageElement);
  alertContainer.appendChild(confirmButton);
  alertContainer.appendChild(cancelButton);

  document.body.appendChild(alertContainer);
}
