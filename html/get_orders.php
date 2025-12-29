<?php
require_once "server.php"; // contains MongoDB connection

header("Content-Type: application/json");

try {
    // Fetch all orders from the 'orders' collection
    $cursor = $OrdersCollection->find([], [
        'sort' => ['timestamp' => -1] // newest first
    ]);

    $orders = [];
    foreach ($cursor as $doc) {
        // Convert BSONDocument to array
        $orders[] = $doc;
    }

    echo json_encode($orders);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
