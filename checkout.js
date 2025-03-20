document.addEventListener('DOMContentLoaded', () => {
  const cardDetailsDiv = document.getElementById('cardDetails');
  const paymentRadios = document.querySelectorAll('input[name="pay"]');
  const amountInput = document.getElementById('totalAmount');
  const payNowButton = document.getElementById('payNowButton');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const applyCouponButton = document.getElementById('applyCouponButton');
  const orderItems = document.getElementById('orderItems');

  // Get the total amount from the cart
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalAmount = cart.reduce((sum, item) => sum + parseFloat(item.price.replace('₱', '').replace(',', '')) * (item.quantity || 1), 0);
  amountInput.value = totalAmount.toFixed(2);
  amountInput.readOnly = true;

  // Populate order summary
  cart.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.name} - ₱${item.price} x ${item.quantity}`;
    orderItems.appendChild(listItem);
  });

  // Show/hide card details based on payment method selection
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      cardDetailsDiv.style.display = radio.id === 'bc1' ? 'block' : 'none';
    });
  });

  // Disable "PAY NOW" button initially
  payNowButton.disabled = true;

  // Function to check if all fields are filled
  function checkFormValidity() {
    const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'city', 'postalCode'];
    const allFilled = requiredFields.every(field => document.getElementById(field).value.trim() !== '');
    payNowButton.disabled = !allFilled;
  }

  // Add event listeners to all input fields to check validity on input
  document.querySelectorAll('.name').forEach(input => {
    input.addEventListener('input', checkFormValidity);
  });

  // Function to validate the card number using Luhn's algorithm
  function checkLuhn(cardNo) {
    let nSum = 0;
    let isSecond = false;
    for (let i = cardNo.length - 1; i >= 0; i--) {
      let d = parseInt(cardNo[i], 10);
      if (isSecond) d *= 2;
      nSum += Math.floor(d / 10) + (d % 10);
      isSecond = !isSecond;
    }
    return (nSum % 10 === 0);
  }

  // Add event listeners for real-time validation and accessibility
  const formFields = {
    firstName: { input: document.getElementById('firstName'), error: document.getElementById('firstNameError') },
    lastName: { input: document.getElementById('lastName'), error: document.getElementById('lastNameError') },
    email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
    phoneNumber: { input: document.getElementById('phoneNumber'), error: document.getElementById('phoneNumberError') },
    address: { input: document.getElementById('address'), error: document.getElementById('addressError') },
    city: { input: document.getElementById('city'), error: document.getElementById('cityError') },
    postalCode: { input: document.getElementById('postalCode'), error: document.getElementById('postalCodeError') },
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
        case 'postalCode':
          isValid = formFields[field].input.value.trim() !== '';
          errorMessage = isValid ? '' : `${field.replace(/([A-Z])/g, ' $1').trim()} is required`;
          break;
        case 'email':
          isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formFields[field].input.value);
          errorMessage = isValid ? '' : 'Invalid email format';
          break;
        case 'phoneNumber':
          isValid = /^(09|\+639)\d{9}$/.test(formFields[field].input.value);
          errorMessage = isValid ? '' : 'Invalid phone number format';
          break;
        case 'cardNumber':
          isValid = checkLuhn(formFields[field].input.value.replace(/\D/g, ''));
          errorMessage = isValid ? '' : 'Invalid card number';
          break;
        case 'cardCVC':
          isValid = formFields[field].input.value.length >= 3 && formFields[field].input.value.length <= 4;
          errorMessage = isValid ? '' : 'Invalid CVC';
          break;
        case 'expMonth':
          const month = parseInt(formFields[field].input.value, 10);
          isValid = !isNaN(month) && month >= 1 && month <= 12;
          errorMessage = isValid ? '' : 'Invalid month';
          break;
        case 'expYear':
          const year = parseInt(formFields[field].input.value, 10);
          const currentYear = new Date().getFullYear();
          isValid = !isNaN(year) && year >= currentYear;
          errorMessage = isValid ? '' : 'Invalid year';
          break;
      }

      formFields[field].error.textContent = errorMessage;
      formFields[field].input.setAttribute('aria-invalid', !isValid);

      if (errorMessage) {
        formFields[field].error.classList.add('show');
      } else {
        formFields[field].error.classList.remove('show');
      }

      // Disable pay now button if any field is invalid
      payNowButton.disabled = !isValid;
    });
  }

  // Function to display the custom alert message
  function displayAlert(message) {
    const alertContainer = document.createElement('div');
    alertContainer.classList.add('custom-alert');

    const messageElement = document.createElement('p');
    messageElement.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
      document.body.removeChild(alertContainer);
    });

    alertContainer.appendChild(messageElement);
    alertContainer.appendChild(closeButton);
    document.body.appendChild(alertContainer);

    setTimeout(() => {
      if (alertContainer.parentNode === document.body) {
        document.body.removeChild(alertContainer);
      }
    }, 2000);
  }

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
      onConfirm();
    });

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(alertContainer);
    });

    alertContainer.appendChild(messageElement);
    alertContainer.appendChild(confirmButton);
    alertContainer.appendChild(cancelButton);
    document.body.appendChild(alertContainer);
  }

  // Add event listener for coupon code application
  applyCouponButton.addEventListener('click', () => {
    const couponCode = document.getElementById('couponCode').value.trim();
    if (couponCode === 'DISCOUNT10') {
      const discount = totalAmount * 0.1;
      amountInput.value = (totalAmount - discount).toFixed(2);
      displayAlert('Coupon applied successfully!');
    } else {
      displayAlert('Invalid coupon code.');
    }
  });

  // Handle "PAY NOW" button click
  payNowButton.addEventListener('click', (event) => {
    const selectedPayment = document.querySelector('input[name="pay"]:checked').id;

    // Form validation
    let isValid = true;

    // Check if all required fields are filled
    const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'city', 'postalCode'];
    requiredFields.forEach(field => {
      if (document.getElementById(field).value.trim() === "") {
        isValid = false;
        displayAlert("Please fill in all required fields before proceeding.");
        return;
      }
    });

    // Additional validation for card details if credit card is selected
    if (selectedPayment === 'bc1') {
      const cardFields = ['cardNumber', 'cardCVC', 'expMonth', 'expYear'];
      cardFields.forEach(field => {
        if (document.getElementById(field).value.trim() === "") {
          isValid = false;
          displayAlert("Please fill in all required card details.");
          return;
        }
      });
    }

    if (isValid) {
      if (totalAmount > 0) {
        event.preventDefault();

        displayConfirmationAlert("Are you sure you want to proceed with the payment?", () => {
          const estimatedSpeed = navigator.connection ? navigator.connection.downlink : 10;
          const loadingTime = estimatedSpeed > 5 ? 5000 : (estimatedSpeed > 2 ? 10000 : 20000);
          loadingIndicator.style.display = 'block';

          setTimeout(() => {
            loadingIndicator.style.display = 'none';

            if (['bc2', 'bc3', 'bc4', 'bc6'].includes(selectedPayment)) {
              window.location.href = 'rating.html';
            } else {
              setTimeout(() => {
                window.location.href = 'rating.html';
              }, 500);
            }

            // Clear the form fields
            Object.keys(formFields).forEach(field => {
              formFields[field].input.value = '';
            });

            // Reset local storage (remove the cart items)
            localStorage.removeItem('cart');
          }, loadingTime);
        });
      } else {
        displayAlert("There is no total amount to pay. Please add items to your cart first.");
      }
    }
  });
});
