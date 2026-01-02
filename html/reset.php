<?php
require_once "server.php"; // include your MongoDB connection

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['reset'])) {
    $username = trim($_POST['username']);
    $newpassword = trim($_POST['newpassword']);

    if (!empty($username) && !empty($newpassword)) {
        $hashedPassword = password_hash($newpassword, PASSWORD_DEFAULT);

        try {
            $result = $UsersCollection->updateOne(
                ['username' => $username],
                ['$set' => ['password' => $hashedPassword]]
            );

            if ($result->getModifiedCount() > 0) {
                $message = "<p class='success'>✅ Password updated successfully. <a href='../index.html'>Login</a></p>";
            } else {
                $message = "<p class='error'>⚠️ Username not found or update failed.</p>";
            }
        } catch (Exception $e) {
            $message = "<p class='error'>❌ Error: " . htmlspecialchars($e->getMessage()) . "</p>";
        }
    } else {
        $message = "<p class='error'>⚠️ Please fill in all fields.</p>";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Password Reset</title>
  <style>
    body {
      font-family: "Segoe UI", Arial, sans-serif;
      background: linear-gradient(135deg, #fbe4e1bd, #f8c9c5, #1baca2, #147a73);
      background-size: 400% 400%;
      animation: gradientShift 12s ease infinite;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .container {
      background: #fff;
      padding: 2rem 3rem;
      border-radius: 16px;
      box-shadow: 0 8px 25px rgba(27, 172, 162, 0.3);
      text-align: center;
      max-width: 420px;
      width: 100%;
      border: 3px solid #f8c9c5;
    }

    h1 {
      margin-bottom: 1rem;
      color: #1baca2;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    input[type="text"],
    input[type="password"] {
      padding: 0.8rem;
      border: 2px solid #fbe4e1bd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    input[type="text"]:focus,
    input[type="password"]:focus {
      border-color: #1baca2;
      box-shadow: 0 0 8px rgba(27, 172, 162, 0.4);
      outline: none;
    }

    button {
      padding: 0.8rem;
      background: #1baca2;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s ease, transform 0.2s ease;
    }

    button:hover {
      background: #147a73;
      transform: scale(1.05);
    }

    .success {
      color: #1baca2;
      font-weight: bold;
      margin-top: 1rem;
    }

    .error {
      color: #e57373;
      font-weight: bold;
      margin-top: 1rem;
    }

    a {
      color: #f8c9c5;
      text-decoration: none;
      font-weight: bold;
    }

    a:hover {
      text-decoration: underline;
      color: #1baca2;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset Password</h1>
    <form method="post">
      <input type="text" name="username" placeholder="Enter your username" required>
      <input type="password" name="newpassword" placeholder="Enter new password" required>
      <button type="submit" name="reset">Reset Password</button>
    </form>
    <?php
      if (!empty($message)) {
          echo $message;
      }
    ?>
  </div>
</body>
</html>
