let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.getElementById("addBtn").addEventListener("click", function () {
  const selected = document.getElementById("itemSelect").value;
  const parts = selected.split("|");

  const item = {
    name: parts[0],
    price: parseInt(parts[1]),
    quantity: 1,
  };

  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));

  window.location.href = "cart.html";
});
