<?php
require_once "server.php";

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;
$status = $data['status'] ?? null;

if (!$id || !$status) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit();
}

try {
    $updateResult = $OrdersCollection->updateOne(
        ['id' => (int)$id],
        ['$set' => ['status' => $status]]
    );

    if ($updateResult->getModifiedCount() > 0) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "No order updated"]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
