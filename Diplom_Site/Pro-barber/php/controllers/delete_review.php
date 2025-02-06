<?php
require_once '../db/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$reviewId = isset($data['id']) ? (int)$data['id'] : null;

if (!$reviewId) {
    echo json_encode(['status' => 'error', 'message' => 'ID отзыва не указан.']);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM reviews WHERE id = :id");
    $stmt->bindValue(':id', $reviewId, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Отзыв не найден.']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Ошибка: ' . $e->getMessage()]);
}
?>