<?php
require_once "server.php"; // where you connect to MongoDB

// Read JSON body
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit();
}

try {
    // Insert into 'orders' collection
    $insertResult = $OrdersCollection->insertOne($data);

    if ($insertResult->getInsertedId()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Insert failed"]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
