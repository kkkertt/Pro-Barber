<?php
require_once '../db/db.php';

$serviceId = isset($_GET['id']) ? (int)$_GET['id'] : null;

if (!$serviceId) {
    echo json_encode(['status' => 'error', 'message' => 'ID услуги не указан.']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM services WHERE id = :id");
    $stmt->bindValue(':id', $serviceId, PDO::PARAM_INT);
    $stmt->execute();
    $service = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($service) {
        echo json_encode(['status' => 'success', 'service' => $service]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Услуга не найдена.']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Ошибка: ' . $e->getMessage()]);
}
?>