<?php

require __DIR__ . '/../vendor/autoload.php'; // Composer autoload for mongodb/mongodb
use MongoDB\Client;

// MongoDB connection

$uri = "mongodb+srv://nicholasmavundlha7_db_user:Coolbird.7@cluster0.bbonaa7.mongodb.net/"; 


try {
    $client = new Client($uri);

    // Select database
    $database = $client->selectDatabase("Users");

    // Define collections
    $UsersCollection      = $database->Users;
    $OrdersCollection     = $database->Orders;

} catch (Throwable $e) {
    // if connection fails
    error_log("MongoDB connection error: " . $e->getMessage());
    http_response_code(500);
    die("Database connection failed. Please check your server.php settings.");
}


