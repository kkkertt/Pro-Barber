<?php
// Подключение файла с настройками базы данных
require_once '../db/db.php';

try {
    // Получение данных из POST-запроса
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        throw new Exception('Invalid JSON data');
    }

    $name = trim($data['name']);
    $phone = trim($data['phone']);
    $agreement = isset($data['agreement']) && $data['agreement'] === 'on';

    // Валидация имени
    if (!preg_match('/^[a-zA-Zа-яА-ЯёЁ\s]+$/', $name)) {
        echo json_encode(['status' => 'error', 'message' => 'Недопустимое имя.']);
        exit;
    }

    // Валидация телефона
    if (!preg_match('/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/', $phone)) {
        echo json_encode(['status' => 'error', 'message' => 'Недопустимый формат телефона.']);
        exit;
    }

    // Проверка согласия на обработку данных
    if (!$agreement) {
        echo json_encode(['status' => 'error', 'message' => 'Необходимо согласиться с политикой обработки данных.']);
        exit;
    }

    // Подготовленный запрос для вставки данных
    $stmt = $pdo->prepare("INSERT INTO bookings (name, phone) VALUES (:name, :phone)");
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':phone', $phone);

    // Выполнение запроса
    $stmt->execute();

    // Ответ клиенту
    echo json_encode(['status' => 'success', 'message' => 'Запись успешно сохранена!']);
} catch (Exception $e) {
    // Обработка ошибок
    echo json_encode(['status' => 'error', 'message' => 'Ошибка: ' . $e->getMessage()]);
}
?>