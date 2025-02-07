<?php
require_once '../db/db.php';

try {
    $stmt = $pdo->query("SELECT * FROM services ORDER BY created_at DESC");
    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'services' => $services
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Ошибка: ' . $e->getMessage()
    ]);
}
?>