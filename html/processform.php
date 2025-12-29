<?php
require_once "server.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $userID   = rand(100000, 999999);
    $password = $_POST['password'];
    $confirm  = $_POST['confirm_password'];

    // check if passwords match
    if ($password !== $confirm) {
        echo "<script>
            alert('Passwords do not match');
            window.location.href='register.html';
        </script>";
        exit();
    }

    // hash password properly
    $hash     = password_hash($password, PASSWORD_DEFAULT);
    $name     = $_POST['name'];
    $surname  = $_POST['surname'];
    $email    = $_POST['email'];
    $username = $_POST['username'];

    // check if username already exists in MongoDB
    $existingUser = $UsersCollection->findOne(['username' => $username]);
    if ($existingUser) {
        echo "<script>
            alert('Username already taken. Please choose a different one.');
            window.location.href='register.html';
        </script>";
        exit();
    }

    $new_entry = [
        'userID'   => $userID,
        'name'     => $name,
        'surname'  => $surname,
        'username' => $username,
        'email'    => $email,
        'password' => $hash
    ];

    // save to MongoDB 
    $insertResult = $UsersCollection->insertOne($new_entry); 

    if ($insertResult->getInsertedId()) {
        echo "<script>
            alert('Registration saved!');
            window.location.href='../index.html';
        </script>";
        exit();
    } else {
        echo "<script>
            alert('Error saving registration');
            window.location.href='register.html';
        </script>";
        exit();
    }
}
