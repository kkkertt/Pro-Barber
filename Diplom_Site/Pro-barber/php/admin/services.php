<?php
require_once '../db/db.php'; 

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 2;
$offset = ($page - 1) * $limit;
$stmt = $pdo->prepare("SELECT * FROM services ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$services = $stmt->fetchAll(PDO::FETCH_ASSOC);
$totalStmt = $pdo->query("SELECT COUNT(*) FROM services");
$totalServices = $totalStmt->fetchColumn();
$totalPages = ceil($totalServices / $limit);

$html = '';
foreach ($services as $service) {
    $html .= "
        <div class='services__item'>
            <img src='{$service['image_url']}' alt='{$service['name']}' class='services__item_img'>
            <div class='services__item_body'>
                <div class='services__item_body-top'>
                    <h3 class='services__body_name'>{$service['name']}</h3>
                    <p class='services__body_price'>{$service['price']} <span class='services__body_price-ruble'>₽</span></p>
                </div>
                <div class='services__item_body-line'></div>
                <p class='services__body_text'>{$service['description']}</p>
            </div>
        </div>
    ";
}

echo json_encode([
    'status' => 'success',
    'html' => $html,
    'totalPages' => $totalPages
]);
?>