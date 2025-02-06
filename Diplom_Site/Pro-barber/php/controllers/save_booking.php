<?php
require_once '../db/db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        throw new Exception('Invalid JSON data');
    }

    $name = trim($data['name']);
    $phone = trim($data['phone']);
    $agreement = isset($data['agreement']) && $data['agreement'] === 'on';

    if (!preg_match('/^[a-zA-Zа-яА-ЯёЁ\s]+$/', $name)) {
        echo json_encode(['status' => 'error', 'message' => 'Недопустимое имя.']);
        exit;
    }

    if (!preg_match('/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/', $phone)) {
        echo json_encode(['status' => 'error', 'message' => 'Недопустимый формат телефона.']);
        exit;
    }

    if (!$agreement) {
        echo json_encode(['status' => 'error', 'message' => 'Необходимо согласиться с политикой обработки данных.']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO bookings (name, phone) VALUES (:name, :phone)");
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':phone', $phone);

    $stmt->execute();

    echo json_encode(['status' => 'success', 'message' => 'Запись успешно сохранена!']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Ошибка: ' . $e->getMessage()]);
}
?>