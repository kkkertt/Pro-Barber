<?php
require_once '../db/db.php';

try {
    $stmt = $pdo->query("SELECT name, text, created_at FROM reviews ORDER BY created_at DESC");
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'reviews' => $reviews]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Ошибка: ' . $e->getMessage()]);
}
?>