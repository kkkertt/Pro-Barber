<?php
require_once '../db/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$bookingId = isset($data['id']) ? (int)$data['id'] : null;

if (!$bookingId) {
    echo json_encode(['status' => 'error', 'message' => 'ID заявки не указан.']);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM bookings WHERE id = :id");
    $stmt->bindValue(':id', $bookingId, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Заявка не найдена.']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Ошибка: ' . $e->getMessage()]);
}
?>