<?php
require_once '../db/db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = trim($data['username']);
    $password = trim($data['password']);

    if (empty($username) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Пожалуйста, заполните все поля.']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id, username, password_hash, role FROM users WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password_hash'])) {
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];

        if ($user['role'] === 'admin') {
            echo json_encode(['status' => 'success', 'redirect' => '../../dashboard.html']);
        } else {
            echo json_encode(['status' => 'success', 'redirect' => '../../index.html']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Неверное имя пользователя или пароль.']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Ошибка: ' . $e->getMessage()]);
}
?>