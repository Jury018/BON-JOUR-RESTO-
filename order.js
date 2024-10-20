// orders.js
let orders = [];

function updateOrderList() {
  const orderList = document.getElementById("orderList").querySelector("ul");
  const orderSummary = document.getElementById("orderSummary");
  orderList.innerHTML = "";
  orderSummary.innerHTML = "";
  let totalPrice = 0;
  let orderItems = [];

  const quantityInputs = document.querySelectorAll('#menu input[type="number"]');
  quantityInputs.forEach(input => {
    const itemName = input.id.replace("quantity-", "");
    const quantity = parseInt(input.value);
    if (quantity > 0) {
      const price = getItemPrice(itemName);
      totalPrice += price * quantity;
      orderItems.push({ name: itemName, quantity: quantity, price: price });
    }
  });

  orderItems.forEach(item => {
    const listItem = document.createElement("li");
    listItem.textContent = `${item.quantity}x ${item.name}`;
    orderList.appendChild(listItem);
  });

  orderSummary.innerHTML = `<h3>Order Summary</h3><p>Total: ₱${totalPrice.toFixed(2)}</p>`;
  document.getElementById("submitOrderBtn").disabled = orderItems.length === 0;
  orders = orderItems;
}

function submitOrder() {
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  try {
    db.collection("orders").add({
      email: email,
      phone: phone,
      items: orders,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(docRef => {
      console.log("Order written with ID:", docRef.id);
      alert("Thank you for your order! It has been submitted.");
      orders = [];
      updateOrderList();
      document.getElementById("orderForm").reset();
    })
    .catch(error => {
      console.error("Error adding order:", error);
    });
  } catch (error) {
    console.error("Error submitting order:", error);
    alert("An error occurred. Please try again later.");
  }
}


let orders = []; // Array to store the current order

function updateOrderList() {
  // ... (code to update the order list and summary dynamically) ...
}

function submitOrder() {
  // ... (code to submit the order to Firestore) ...
}
