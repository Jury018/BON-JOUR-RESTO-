// JavaScript for hamburger menu
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav-list');

hamburger.addEventListener('click', () => {
  navList.classList.toggle('active');
  hamburger.classList.toggle('active'); // Toggle the "X" animation
});

// Get cart data from local storage and populate the order textarea
    const orderTextarea = document.getElementById('order');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length > 0) {
      let orderText = "";
      cart.forEach(item => {
        orderText += `${item.name} - ${item.price}\n`; 
      });
      orderTextarea.value = orderText;
    }