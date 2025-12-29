function showTab(tabId) {
  document.querySelectorAll(".tab-pane").forEach(pane => {
    pane.classList.remove("active");
  });
  document.getElementById(tabId).classList.add("active");

  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.tab-btn[onclick="showTab('${tabId}')"]`).classList.add("active");
}

// Load dashboard data
function loadActivity() {
  fetch("../html/get_orders.php")
    .then(res => res.json())
    .then(orders => {
      // Stats
      document.getElementById("totalOrders").textContent = orders.length;
      document.getElementById("pendingOrders").textContent = orders.filter(o => o.status === "Pending...").length;
      document.getElementById("doneOrders").textContent = orders.filter(o => o.status === "Done").length;
      document.getElementById("rejectedOrders").textContent = orders.filter(o => o.status === "Rejected").length;

      // Recent Activity
      const recentDiv = document.getElementById("recent");
      recentDiv.innerHTML = "";
      orders.slice(0, 5).forEach(order => {
        recentDiv.innerHTML += `
          <div class="card">
            <h3>Order #${order.id}</h3>
            <p>Referrence: ${order.customer}</p>
            <p>Status: ${order.status}</p>
            <p>Date: ${new Date(order.timestamp).toLocaleString()}</p>
            <p>Items: ${order.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}</p>
          </div>
        `;
      });

      // Users tab (example: show distinct customers)
      const usersDiv = document.getElementById("users");
      usersDiv.innerHTML = "";
      const customers = [...new Set(orders.map(o => o.customer))];
      customers.forEach(c => {
        usersDiv.innerHTML += `<div class="card"><h3>${c}</h3></div>`;
      });

      // System logs (placeholder)
      const systemDiv = document.getElementById("system");
      systemDiv.innerHTML = `
        <div class="card"><p>System running smoothly ✅</p></div>
      `;
    })
    .catch(err => console.error("Error loading activity:", err));
}

// Auto refresh every 10 seconds
setInterval(loadActivity, 10000);

// Initial load
loadActivity();
