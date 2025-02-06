<?php
require_once '../db/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$serviceId = isset($data['id']) ? (int)$data['id'] : null;
$name = trim($data['name']);
$price = (int)$data['price'];
$description = trim($data['description']);
$imageUrl = trim($data['image_url']);

if (!$serviceId || !$name || !$price || !$description || !$imageUrl) {
    echo json_encode(['status' => 'error', 'message' => 'Не все данные предоставлены.']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE services SET name = :name, price = :price, description = :description, image_url = :image_url WHERE id = :id");
    $stmt->bindValue(':name', $name, PDO::PARAM_STR);
    $stmt->bindValue(':price', $price, PDO::PARAM_INT);
    $stmt->bindValue(':description', $description, PDO::PARAM_STR);
    $stmt->bindValue(':image_url', $imageUrl, PDO::PARAM_STR);
    $stmt->bindValue(':id', $serviceId, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(['status' => 'success']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Ошибка: ' . $e->getMessage()]);
}
?>