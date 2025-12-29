// Get cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cartItems");
const summary = document.getElementById("summary");
const deliverySection = document.getElementById("deliverySection");
const deliveryCheck = document.getElementById("deliveryCheck");
const addressInput = document.getElementById("address");
const proceedContainer = document.getElementById("proceedContainer");
const backBtn = document.getElementById("backBtn");

// Function to display cart
function displayCart() {
  // Only run if we're on the cart page (elements exist)
  if (!cartItems) return;
  
  cartItems.innerHTML = "";
  let total = 0;
  let totalQty = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    if (deliverySection) deliverySection.style.display = "none";
    if (proceedContainer) proceedContainer.style.display = "none";
    if (backBtn) backBtn.style.display = "inline-block";
    if (summary) summary.innerText = "";
    return;
  } else {
    if (deliverySection) deliverySection.style.display = "block";
    if (proceedContainer) proceedContainer.style.display = "block";
    if (backBtn) backBtn.style.display = "none";
  }

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    totalQty += item.quantity;

    cartItems.innerHTML += `
      <div class="cart-item">
        <strong style="background-color: #fdf2e9;">${item.name}</strong><br>
        Price: R${item.price}<br>
        Quantity:
        <input type="number" min="1" value="${item.quantity}" 
          onchange="updateQty(${index}, this.value)">
        <br>
        <button onclick="deleteItem(${index})">Delete</button>
      </div>
    `;
  });

  // Add delivery fee if checked
  if (deliveryCheck && deliveryCheck.checked) {
    total += 30;
  }

  if (summary) summary.innerText = "Items: " + totalQty + " | Total: R" + total;
}

// Function to update quantity
function updateQty(index, value) {
  cart[index].quantity = parseInt(value);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Function to delete item
function deleteItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Function to go back to order page
function goBack() {
  window.location.href = "order.html";
}

// Function to proceed to payment
function goToPayment() {
  localStorage.setItem("cart", JSON.stringify(cart));
  if (deliveryCheck) localStorage.setItem("delivery", deliveryCheck.checked);
  if (addressInput) localStorage.setItem("address", addressInput.value);
  window.location.href = "payment.html";
}

// Show/hide address input if delivery is checked
if (deliveryCheck) {
  deliveryCheck.addEventListener("change", function () {
    if (this.checked) {
      addressInput.style.display = "block";
    } else {
      addressInput.style.display = "none";
    }
    displayCart();
  });
}

// Function to clear cart
function clearCart() {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Initial render (only if on cart page)
if (cartItems) {
  displayCart();
}
// Function called when payment is completed

function paid() {
  let currentCart = JSON.parse(localStorage.getItem("cart")) || [];
  if (currentCart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let isDelivery = localStorage.getItem("delivery") === "true";
  let deliveryAddress = localStorage.getItem("address") || "";
  let customer = localStorage.getItem("username")||"";
  let newOrder = {
    customer: customer,
    id: Date.now(),
    items: currentCart,
    delivery: isDelivery,
    address: deliveryAddress,
    timestamp: new Date().toISOString(),
    status: "Pending..."
  };

  // Send newOrder to backend
  fetch("../html/save_order.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newOrder)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Order placed successfully!");
      localStorage.setItem("cart", JSON.stringify([]));
      localStorage.removeItem("delivery");
      localStorage.removeItem("address");
      window.location.href = "../html/track.html";
    } else {
      alert("Error saving order: " + data.message);
    }
  })
  .catch(err => {
    console.error("Error:", err);
    alert("Could not save order.");
  });
}
