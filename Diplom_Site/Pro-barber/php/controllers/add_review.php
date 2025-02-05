<?php
require_once '../db/db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);

    $name = trim($data['name']);
    $text = trim($data['text']);
    if (empty($name) || empty($text)) {
        echo json_encode(['status' => 'error', 'message' => 'Все поля обязательны для заполнения.']);
        exit;
    }
    $stmt = $pdo->prepare("INSERT INTO reviews (name, text) VALUES (:name, :text)");
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':text', $text);
    $stmt->execute();

    echo json_encode(['status' => 'success', 'message' => 'Отзыв успешно добавлен!']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Ошибка: ' . $e->getMessage()]);
}
?>