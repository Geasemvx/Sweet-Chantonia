<?php
require_once "server.php";

session_start();

// Capture POST data
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

// Function to display error with toast overlay
function showError($message) {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                margin: 0;
                padding: 0;
            }
            
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

            .toast.error {
              background: #f8d7da;
              color: #721c24;
              border: 1px solid #f5c6cb;
            }

            .toast.show {
              opacity: 1;
              transform: translateY(0);
            }
        </style>
    </head>
    <body>
        <script>
            // Store error in sessionStorage
            sessionStorage.setItem('loginError', <?php echo json_encode($message); ?>);
            
            // Go back to previous page
            window.history.back();
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
        localStorage.setItem('username', '" . addslashes($username) . "'); 
        // redirect after setting localStorage 
        if ('" . addslashes($username) . "' === 'Tonia') { 
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