function showTab(tabId) {
  document.querySelectorAll(".tab-pane").forEach(pane => {
    pane.classList.remove("active");
  });
  document.getElementById(tabId).classList.add("active");

  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.tab-btn[onclick="showTab('${tabId}')"]`).classList.add("active");
}

// Load orders from backend
function loadOrders() {
  fetch("../html/get_orders.php")
    .then(res => res.json())
    .then(orders => {
      const pendingDiv = document.getElementById("pending");
      const doneDiv = document.getElementById("done");
      const rejectedDiv = document.getElementById("rejected");

      pendingDiv.innerHTML = "";
      doneDiv.innerHTML = "";
      rejectedDiv.innerHTML = "";

      orders.forEach(order => {
        const orderDiv = document.createElement("div");
        orderDiv.className = "order-card";
        orderDiv.innerHTML = `
          <h3>Order #${order.id}</h3>
          <p>Referrence: ${order.customer}</p>
          <p>Status: ${order.status}</p>
          <p>Date: ${new Date(order.timestamp).toLocaleString()}</p>
          <p>Items: ${order.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}</p>
        `;

        if (order.status === "Pending...") {
          const doneBtn = document.createElement("button");
          doneBtn.textContent = "Done";
          doneBtn.className = "done-btn";
          doneBtn.onclick = () => updateOrderStatus(order.id, "Done");

          const rejectBtn = document.createElement("button");
          rejectBtn.textContent = "Reject";
          rejectBtn.className = "reject-btn";
          rejectBtn.onclick = () => updateOrderStatus(order.id, "Rejected");

          orderDiv.appendChild(doneBtn);
          orderDiv.appendChild(rejectBtn);

          pendingDiv.appendChild(orderDiv);
        } else if (order.status === "Done") {
          doneDiv.appendChild(orderDiv);
        } else if (order.status === "Rejected") {
          rejectedDiv.appendChild(orderDiv);
        }
      });

      // Show placeholders if empty
      if (pendingDiv.innerHTML === "") {
        pendingDiv.innerHTML = `
          <div style="text-align:center; padding:40px;">
            <i class="fas fa-hourglass-half" style="font-size:60px; color:#ccc;"></i>
            <p style="margin-top:20px; font-size:18px; color:#655;">No pending orders right now.</p>
          </div>
        `;
      }
      if (doneDiv.innerHTML === "") {
        doneDiv.innerHTML = `
          <div style="text-align:center; padding:40px;">
            <i class="fas fa-check-circle" style="font-size:60px; color:#28a745;"></i>
            <p style="margin-top:20px; font-size:18px; color:#655;">No completed orders yet.</p>
          </div>
        `;
      }
      if (rejectedDiv.innerHTML === "") {
        rejectedDiv.innerHTML = `
          <div style="text-align:center; padding:40px;">
            <i class="fas fa-times-circle" style="font-size:60px; color:#dc3545;"></i>
            <p style="margin-top:20px; font-size:18px; color:#655;">No rejected orders.</p>
          </div>
        `;
      }
    })
    .catch(err => console.error("Error loading orders:", err));
}


// Update order status
function updateOrderStatus(orderId, newStatus) {
  fetch("../html/update_order.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: orderId, status: newStatus })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      loadOrders(); // refresh UI
    } else {
      alert("Error updating order: " + data.message);
    }
  })
  .catch(err => console.error("Error updating order:", err));
}
// Initial load
loadOrders();
showTab("pending");

// Auto refresh every 10 seconds
setInterval(() => {
  loadOrders();
}, 10000);

