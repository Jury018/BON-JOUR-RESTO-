// menu.js
const firebaseConfig = {
  apiKey: "AIzaSyCmQ3twke1IpprDDAE2OgNOWRUR7-VoCAI", // Replace with your actual API key
  authDomain: "bon-jour-base.firebaseapp.com", // Replace with your actual auth domain
  // ... other config values ...
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let menuData = {};

function fetchMenuData() {
  db.collection("Menu").get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        menuData[doc.id] = doc.data().items;
      });
      generateMenuHTML(menuData);
    })
    .catch(error => {
      console.error("Error fetching menu data:", error);
      // Consider adding a user-friendly error message here
    });
}

function generateMenuHTML(menuData) {
  const menuSection = document.getElementById("menu");

  for (const category in menuData) {
    const menuList = document.createElement("div");
    menuList.classList.add("menu-section");

    const categoryTitle = document.createElement("h3");
    categoryTitle.textContent = category;
    menuList.appendChild(categoryTitle);

    const itemsList = document.createElement("ul");
    menuData[category].forEach(item => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `${item.name} - ₱${item.price}
                            <input type="number" id="quantity-${item.name}" min="0" value="0" onchange="updateOrderList()">`;
      itemsList.appendChild(listItem);
    });
    menuList.appendChild(itemsList);
    menuSection.appendChild(menuList);
  }
}

function getItemPrice(itemName) {
  for (const category in menuData) {
    const item = menuData[category].find(item => item.name === itemName);
    if (item) {
      return item.price;
    }
  }
  return 0;
}

fetchMenuData();
