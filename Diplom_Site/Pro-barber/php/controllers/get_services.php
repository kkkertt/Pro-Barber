<?php
require_once '../db/db.php'; // Подключение к базе данных

try {
    // Запрос для получения всех услуг
    $stmt = $pdo->query("SELECT * FROM services ORDER BY created_at DESC");
    $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Возвращаем успешный ответ с данными
    echo json_encode([
        'status' => 'success',
        'services' => $services
    ]);
} catch (Exception $e) {
    // Возвращаем ошибку, если что-то пошло не так
    echo json_encode([
        'status' => 'error',
        'message' => 'Ошибка: ' . $e->getMessage()
    ]);
}
?>