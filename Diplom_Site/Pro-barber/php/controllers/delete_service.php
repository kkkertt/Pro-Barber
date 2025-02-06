<?php
require_once '../db/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$serviceId = isset($data['id']) ? (int)$data['id'] : null;

if (!$serviceId) {
    echo json_encode(['status' => 'error', 'message' => 'ID услуги не указан.']);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM services WHERE id = :id");
    $stmt->bindValue(':id', $serviceId, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Услуга не найдена.']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Ошибка: ' . $e->getMessage()]);
}
?>