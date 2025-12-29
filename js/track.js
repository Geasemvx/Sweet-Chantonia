const orderHistoryContainer = document.getElementById("orderHistory");

// Function to display order history
function displayOrders() {
  orderHistoryContainer.innerHTML = "";

  // Get current customer username from localStorage
  const currentUser = localStorage.getItem("username") || "";

  // Fetch orders from backend (MongoDB via get_orders.php)
  fetch("../html/get_orders.php")
    .then(res => res.json())
    .then(orderHistory => {
      // Filter orders by username
      const userOrders = orderHistory.filter(order => order.customer === currentUser);

      if (!userOrders || userOrders.length === 0) {
        orderHistoryContainer.innerHTML = `
          <div style="text-align: center; padding: 40px;">
  <i class="fas fa-box-open" style="font-size: 60px; color: #ccc;"></i>
  <p style="margin-top: 20px; font-size: 18px; color: #655;">No orders to track yet.</p>
  <a href="order.html" class="shop-btn">Start Shopping</a>
</div>

<style>
  .shop-btn {
    display: inline-block;
    margin-top: 15px;
    padding: 10px 20px;
    background: #088178;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background 0.3s ease;
  }

  .shop-btn:hover {
    background: #47cac1ff;
  }
    
</style>

        `;
        return;
      }

      // Display all orders for this user (most recent first)
      userOrders.forEach((order) => {
        let total = 0;
        let totalQty = 0;

        // Calculate totals for this order
        order.items.forEach(item => {
          total += item.price * item.quantity;
          totalQty += item.quantity;
        });

        // Add delivery fee if applicable
        if (order.delivery) {
          total += 30;
        }

        // Format date
        const orderDate = new Date(order.timestamp);
        const formattedDate = orderDate.toLocaleDateString('en-ZA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        // Create order container
        orderHistoryContainer.innerHTML += `
          <div style="

          border: 3px solid #088178; padding: 20px; margin-bottom: 25px; border-radius: 10px; background: #f9f9f9;">
            <div style="display: flex;
            background-color: #f9f9f9;
            justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <h3 style="margin: 0;background-color: #f9f9f9; color: #088178;">Order #${order.id}</h3>
              <span style="background: #fff3cd; color: #856404; padding: 5px 15px; border-radius: 20px; font-weight: bold;">
                ${order.status}
              </span>
            </div>
            
            <p style="color: #655; background-color: #f9f9f9;margin: 5px 0;"><strong style="background-color: #f9f9f9";>Date:</strong> ${formattedDate}</p>
            
            ${order.delivery ? 
              `<p style="color: #655; background-color: #f9f9f9;margin: 5px 0;"><strong style="background-color: #f9f9f9;">Delivery Address:</strong> ${order.address}</p>
               <p style="color: #655; background-color: #f9f9f9;margin: 5px 0;"><strong style="background-color: #f9f9f9;">Delivery Fee:</strong> R30</p>` : 
              '<p style="color: #655; background-color: #f9f9f9; margin: 5px 0;"><strong style="background-color: #f9f9f9;">Type:</strong> Pickup</p>'
            }
            
            <hr style="margin: 15px 0; background-color: #f9f9f9;border: none; border-top: 1px solid #ddd;">
            
            <h4 style="margin: 10px 0; background-color: #f9f9f9;color: #333;">Items:</h4>
            ${order.items.map(item => `
              <div style="padding: 10px; background-color: #f9f9f9;margin: 5px 0; background: white; border-radius: 5px; display: flex; justify-content: space-between;">
                <div style="color: #655;background-color: #f9f9f9;">
                  <strong style="background-color: #f9f9f9;">${item.name}</strong><br>
                  <span style="background-color: #f9f9f9;">R${item.price} × ${item.quantity}</span>
                </div>
                <div style="text-align: right; background-color: #f9f9f9;">
                  <strong style="background-color: #f9f9f9;">R${item.price * item.quantity}</strong>
                </div>
              </div>
            `).join('')}
            
            <hr style="margin: 15px 0; background-color: #f9f9f9;border: none; border-top: 1px solid #ddd;">
            
            <div style="display: flex; justify-content: space-between; background-color: #f9f9f9;font-size: 18px; font-weight: bold; color: #088178;">
              <span style="background-color: #f9f9f9;">Total Items: ${totalQty}</span>
              <span style="background-color: #f9f9f9;">Total: R${total}</span>
            </div>
          </div>
        `;
      });
    })
    .catch(err => {
      console.error("Error fetching orders:", err);
      orderHistoryContainer.innerHTML = "<p style='color:red;'>Error loading orders.</p>";
    });
}

// Initial render
displayOrders();
