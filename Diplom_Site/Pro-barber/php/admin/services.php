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
			<div class='services__item' data-id='{$service['id']}'>
					<button class='delete-btn' data-id='{$service['id']}' data-type='service'></button>
					<button class='edit-btn' data-id='{$service['id']}' data-type='service'></button>
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

// $html .= "
// 	<div id='modal' class='modal' style='display: none;'>
// 			<div class='modal-content'>
// 					<span class='close-modal' id='close-modal'>&times;</span>
// 					<h2>Редактирование услуги</h2>
// 					<form id='edit-service-form'>
// 							<input type='hidden' id='service-id' name='id'>
// 							<label for='name'>Название:</label>
// 							<input type='text' id='name' name='name' required><br>

// 							<label for='price'>Цена:</label>
// 							<input type='number' id='price' name='price' required><br>

// 							<label for='description'>Описание:</label>
// 							<textarea id='description' name='description' required></textarea><br>

// 							<label for='image_url'>URL изображения:</label>
// 							<input type='text' id='image_url' name='image_url' required><br>

// 							<button type='submit'>Сохранить изменения</button>
// 					</form>
// 			</div>
// 	</div>
// ";

echo json_encode([
    'status' => 'success',
    'html' => $html,
    'totalPages' => $totalPages
]);
?>