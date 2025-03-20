document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');
  const navLinks = document.querySelectorAll('.nav-list a');
  const cartIcon = document.querySelector('.cart-icon');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const menuItem = button.closest('.menu-item');
      const productName = menuItem.querySelector('h3').textContent;
      const productPrice = menuItem.querySelector('p:nth-of-type(2)').textContent;

      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push({ name: productName, price: productPrice });
      localStorage.setItem('cart', JSON.stringify(cart));

      // Add animation effect
      const clone = menuItem.cloneNode(true);
      const rect = menuItem.getBoundingClientRect();
      clone.style.position = 'fixed';
      clone.style.left = `${rect.left}px`;
      clone.style.top = `${rect.top}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.transition = 'all 1s ease-in-out';
      clone.style.zIndex = '1000';
      document.body.appendChild(clone);

      const cartRect = cartIcon.getBoundingClientRect();
      setTimeout(() => {
        clone.style.left = `${cartRect.left + cartRect.width / 2 - rect.width / 2}px`;
        clone.style.top = `${cartRect.top + cartRect.height / 2 - rect.height / 2}px`;
        clone.style.width = '0px';
        clone.style.height = '0px';
        clone.style.opacity = '0';
      }, 100);

      setTimeout(() => {
        document.body.removeChild(clone);
      }, 1100);

      menuItem.classList.add('added-to-cart');
      setTimeout(() => {
        menuItem.classList.remove('added-to-cart');
      }, 500);
    });
  });

  hamburger.addEventListener('click', () => {
    navList.classList.toggle('expanded');
    hamburger.classList.toggle('active');
  });

  function hideNavigation() {
    navList.classList.remove('expanded');
    hamburger.classList.remove('active');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', hideNavigation);
  });

  function displayAlert(message) {
    const alertMessage = document.getElementById("alertMessage");
    const customAlert = document.getElementById("customAlert");
    alertMessage.textContent = message;
    customAlert.style.display = "block";

    setTimeout(closeAlert, 2000);
  }

  function closeAlert() {
    const customAlert = document.getElementById("customAlert");
    customAlert.style.display = "none";
  }

  function showLoading(event) {
    event.preventDefault();

    const customLoading = document.getElementById("customLoading");
    customLoading.style.display = "block";

    const simulatedLoadingTime = Math.random() * 2000 + 1000;

    setTimeout(() => {
      if (event.target.href) {
        window.location.href = event.target.href;
      } else {
        window.location.href = 'cart.html';
      }

      setTimeout(() => {
        customLoading.style.display = "none";
      }, 1000);
    }, simulatedLoadingTime);
  }

  function checkCartAndRedirect(event) {
    event.preventDefault();

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length > 0) {
      window.location.href = 'cart.html';
    } else {
      displayAlert("Your cart is empty. Please add items to your order first.");
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', showLoading);
  });

  cartIcon.addEventListener('click', checkCartAndRedirect);
});
