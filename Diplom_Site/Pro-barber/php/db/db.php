<?php
$host = 'localhost';
$dbname = 'Pro-barber';
$user = 'postgres';
$password = 'root';

try {
	// Подключение к базе данных
	$pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $password);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
	die(json_encode(['status' => 'error', 'message' => 'Database connection error: ' . $e->getMessage()]));
}
?>