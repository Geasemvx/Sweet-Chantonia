window.onload = function () {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const delivery = localStorage.getItem("delivery") === "true";
  const address = localStorage.getItem("address");

  let summary = "";
  let total = 0;

  cart.forEach((item) => {
    summary += `${item.name} x ${item.quantity}<br>`;
    total += item.price * item.quantity;
  });

  if (delivery) {
    summary += `<br><strong>Delivery:</strong> R30<br>`;
    summary += `<strong>Address:</strong> ${address}`;
    total += 30;
  } else {
    summary += "<br><strong>No Delivery</strong>";
  }

  document.getElementById("orderDetail").innerHTML = summary;
  document.getElementById("totalAmount").innerText = "Total to Pay: R" + total;
};
