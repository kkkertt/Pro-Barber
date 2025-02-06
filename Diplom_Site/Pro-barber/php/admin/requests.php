<?php
require_once '../db/db.php'; 

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 5;
$offset = ($page - 1) * $limit;

$stmt = $pdo->prepare("SELECT id, name, phone, status, created_at FROM bookings ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
$totalStmt = $pdo->query("SELECT COUNT(*) FROM bookings");
$totalBookings = $totalStmt->fetchColumn();
$totalPages = ceil($totalBookings / $limit);

$html = '';
foreach ($bookings as $booking) {
    $html .= "
        <div class='request'>
            <h3>{$booking['name']}</h3>
            <p>Телефон: {$booking['phone']}</p>
            <p>Статус: 
                <select class='status-select' data-id='{$booking['id']}'>
                    <option value='new' " . ($booking['status'] === 'new' ? 'selected' : '') . ">Новая</option>
                    <option value='confirmed' " . ($booking['status'] === 'confirmed' ? 'selected' : '') . ">Подтверждена</option>
                    <option value='completed' " . ($booking['status'] === 'completed' ? 'selected' : '') . ">Завершена</option>
                </select>
            </p>
            <p>Дата создания: " . date('d.m.Y H:i', strtotime($booking['created_at'])) . "</p>
						<button class='delete-btn' data-id='{$booking['id']}' data-type='booking'></button>
        </div>
    ";
}

echo json_encode([
    'status' => 'success',
    'html' => $html,
    'totalPages' => $totalPages
]);
?>