<?php
require_once "server.php";

session_start();

// Capture POST data
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

// Function to display error with toast
function showError($message) {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            /* Toast container */
            .toast {
              position: fixed;
              top: 20px;
              right: 20px;
              min-width: 250px;
              padding: 15px 20px;
              border-radius: 8px;
              font-family: Arial, sans-serif;
              font-size: 14px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              opacity: 0;
              transform: translateY(-10px);
              transition: opacity 0.4s ease, transform 0.4s ease;
              z-index: 9999;
            }

            /* Variants */
            .toast.error {
              background: #f8d7da;
              color: #721c24;
              border: 1px solid #f5c6cb;
            }

            .toast.success {
              background: #d4edda;
              color: #155724;
              border: 1px solid #c3e6cb;
            }

            .toast.show {
              opacity: 1;
              transform: translateY(0);
            }
        </style>
    </head>
    <body>
        <script>
            function showToast(message, type = "error") {
                const toast = document.createElement("div");
                toast.className = `toast ${type}`;
                toast.textContent = message;
                document.body.appendChild(toast);

                // Animate in
                setTimeout(() => toast.classList.add("show"), 10);

                // Auto remove and go back after 3 seconds
                setTimeout(() => {
                    toast.classList.remove("show");
                    setTimeout(() => {
                        toast.remove();
                        window.history.back();
                    }, 400);
                }, 3000);
            }

            // Show the toast immediately
            showToast(<?php echo json_encode($message); ?>, "error");
        </script>
    </body>
    </html>
    <?php
    exit;
}

// Validate input
if (!$username || !$password) {
    showError('Username and password are required.');
}

try {
    // Find user by username
    $user = $UsersCollection->findOne(['username' => $username]);

    if (!$user) {
        showError('User not found. Please try again.');
    }

    // Verify password
    if (password_verify($password, $user['password'])) { 
        $_SESSION['user'] = $user->getArrayCopy(); 
        echo "<script> 
        localStorage.setItem('username', '" . $username . "'); 
        // redirect after setting localStorage 
        if ('" . $username . "' === 'Tonia') { 
            window.location.href = 'dash.html'; } 
        else { 
            window.location.href = 'home.html'; } 
        </script>"; 
        exit; 
    } else {
        showError('Incorrect password. Want to try again? 🔑');
    }
} catch (Exception $e) {
    showError('Error connecting to MongoDB: ' . htmlspecialchars($e->getMessage()));
}
?>