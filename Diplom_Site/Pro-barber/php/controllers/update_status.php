<?php
require_once '../db/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$bookingId = isset($data['id']) ? (int)$data['id'] : null;
$newStatus = isset($data['status']) ? trim($data['status']) : null;

if (!$bookingId || !$newStatus) {
    echo json_encode(['status' => 'error', 'message' => 'ID заявки или новый статус не указаны.']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE bookings SET status = :status WHERE id = :id");
    $stmt->bindValue(':status', $newStatus, PDO::PARAM_STR);
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