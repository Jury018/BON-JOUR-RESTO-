document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');

  hamburger.addEventListener('click', () => {
    navList.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function updateCart() {
    const cartItemsList = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');

    cartItemsList.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
      cartItemsList.classList.add('empty-cart');
      cartItemsList.innerHTML = "<li>Your cart is empty.</li>";
    } else {
      cartItemsList.classList.remove('empty-cart');
      cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <span class="item-name">${item.name}</span>
          <div class="quantity-controls">
            <button class="decrease-quantity" data-index="${index}">-</button>
            <span class="item-quantity">${item.quantity || 1}</span>
            <button class="increase-quantity" data-index="${index}">+</button>
          </div>
          <span class="item-price">${item.price}</span>
          <button class="remove-item" data-index="${index}">Remove</button>
        `;
        cartItemsList.appendChild(listItem);

        subtotal += parseFloat(item.price.replace('₱', '').replace(',', '')) * (item.quantity || 1);
      });
    }

    cartSubtotal.textContent = '₱' + subtotal.toFixed(2);
    cartTotal.textContent = '₱' + subtotal.toFixed(2);

    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const indexToRemove = button.dataset.index;
        cart.splice(indexToRemove, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
      });
    });

    const decreaseButtons = document.querySelectorAll('.decrease-quantity');
    decreaseButtons.forEach(button => {
      button.addEventListener('click', () => {
        const index = button.dataset.index;
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
        } else {
          cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
      });
    });

    const increaseButtons = document.querySelectorAll('.increase-quantity');
    increaseButtons.forEach(button => {
      button.addEventListener('click', () => {
        const index = button.dataset.index;
        cart[index].quantity = (cart[index].quantity || 1) + 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
      });
    });
  }

  updateCart();

  function showModernAlert(title, message, type, buttons = []) {
    const alertContainer = document.querySelector('.alert-container');
    const alertTitle = alertContainer.querySelector('.alert-title');
    const alertMessage = alertContainer.querySelector('.alert-message');
    const alertButtons = alertContainer.querySelector('.alert-buttons');

    alertTitle.textContent = title;
    alertMessage.textContent = message;

    alertButtons.innerHTML = '';

    buttons.forEach(button => {
      const buttonElement = document.createElement('button');
      buttonElement.classList.add('alert-button');
      if (button.primary) {
        buttonElement.classList.add('primary');
      }
      buttonElement.textContent = button.text;
      buttonElement.addEventListener('click', () => {
        if (button.onclick) {
          button.onclick();
        }
        hideModernAlert();
      });
      alertButtons.appendChild(buttonElement);
    });

    alertButtons.style.justifyContent = 'center';

    alertContainer.classList.add('show');
  }

  function hideModernAlert() {
    const alertContainer = document.querySelector('.alert-container');
    alertContainer.classList.remove('show');
  }

  const alertClose = document.querySelector('.alert-close');
  alertClose.addEventListener('click', hideModernAlert);

  function showLoading() {
    document.getElementById('customLoading').style.display = 'flex';
  }

  function hideLoading() {
    document.getElementById('customLoading').style.display = 'none';
  }

  function checkCartAndRedirect() {
    showLoading();
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    setTimeout(() => {
      if (cart.length > 0) {
        window.location.href = 'cart.html';
      } else {
        hideLoading();
        showModernAlert('', 'Your cart is empty. Please add items to your order first.', '', [
          { text: 'OK', primary: true }
        ]);
      }
    }, 1000);
  }

  function proceedToCheckout() {
    showLoading();
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    setTimeout(() => {
      if (cart.length > 0) {
        window.location.href = 'checkout.html';
      } else {
        hideLoading();
        showModernAlert('', 'Your cart is empty. Please add items to your order first.', '', [
          { text: 'OK', onclick: () => { window.location.href = 'foodmenu.html'; }, primary: true }
        ]);
      }
    }, 1000);
  }

  window.checkCartAndRedirect = checkCartAndRedirect;
  window.proceedToCheckout = proceedToCheckout;
  window.showLoading = showLoading;

  // Ensure loading spinner is hidden on page load
  hideLoading();
});
