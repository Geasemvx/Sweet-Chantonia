<?php
require_once "server.php"; // include your MongoDB connection

if (isset($_POST['reset'])) {
    $username = $_POST['username'];
    $newpassword = $_POST['newpassword'];

    // Hash the new password for security
    $hashedPassword = password_hash($newpassword, PASSWORD_DEFAULT);

    try {
        // Update the user's password
        $result = $UsersCollection->updateOne(
            ['username' => $username],
            ['$set' => ['password' => $hashedPassword]]
        );

        if ($result->getModifiedCount() > 0) {
            echo "✅ Password updated successfully. <a href='../index.html'>Login</a>";
        } else {
            echo "⚠️ Username not found or update failed.";
        }
    } catch (Exception $e) {
        echo "❌ Error: " . $e->getMessage();
    }
}
?>
