firebase.initializeApp(firebaseConfig); // Initialize Firebase with your config
const db = firebase.firestore(); // Get a reference to Firestore

function fetchMenuData() {
  db.collection("Menu").get() // Fetch data from the "Menu" collection
    .then(querySnapshot => {
      const menuData = {};
      querySnapshot.forEach(doc => {
        menuData[doc.id] = doc.data().items; // Store menu items in an object
      });
      generateMenuHTML(menuData); // Generate the HTML for the menu
    })
    .catch(error => {
      console.error("Error fetching menu data:", error); // Error handling
    });
}

function generateMenuHTML(menuData) {
  const menuSection = document.getElementById("menu"); // Get the menu container

  for (const category in menuData) { // Loop through categories
    const menuList = document.createElement("div");
    menuList.classList.add("menu-section");

    const categoryTitle = document.createElement("h3");
    categoryTitle.textContent = category;
    menuList.appendChild(categoryTitle);

    const itemsList = document.createElement("ul");
    menuData[category].forEach(item => { // Loop through items in each category
      const listItem = document.createElement("li");
      listItem.innerHTML = `${item.name} - ₱${item.price}
                            <input type="number" id="quantity-${item.name}" min="0" value="0" onchange="updateOrderList()">`; // Create list item with quantity input
      itemsList.appendChild(listItem);
    });
    menuList.appendChild(itemsList);
    menuSection.appendChild(menuList);
  }
}

function getItemPrice(itemName) { // Helper function to get the price of an item
  for (const category in menuData) {
    const item = menuData[category].find(item => item.name === itemName);
    if (item) {
      return item.price;
    }
  }
  return 0;
}

fetchMenuData(); // Fetch the menu data when the script loads
