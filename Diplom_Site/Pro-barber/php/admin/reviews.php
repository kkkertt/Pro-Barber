<?php
require_once '../db/db.php'; 

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = 7;
$offset = ($page - 1) * $limit;

$stmt = $pdo->prepare("SELECT * FROM reviews ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

$totalStmt = $pdo->query("SELECT COUNT(*) FROM reviews");
$totalReviews = $totalStmt->fetchColumn();
$totalPages = ceil($totalReviews / $limit);

$html = '';
foreach ($reviews as $review) {
    $html .= '
<div class="reviews__row_bottom" id="reviewsContainer">
    <div class="reviews__item">
    <button class="delete-btn" data-id="' . $review['id'] . '"></button>
        <svg class="reviews__item_svg" width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="34" cy="34" r="32.5" stroke="#DD9714" stroke-width="3"></circle>
            <path d="M33.9993 28.8333C38.6017 28.8333 42.3327 25.1023 42.3327 20.5C42.3327 15.8976 38.6017 12.1666 33.9993 12.1666C29.397 12.1666 25.666 15.8976 25.666 20.5C25.666 25.1023 29.397 28.8333 33.9993 28.8333Z" fill="#DD9714"></path>
            <path d="M50.6673 44.4584C50.6673 49.6355 50.6673 53.8334 34.0007 53.8334C17.334 53.8334 17.334 49.6355 17.334 44.4584C17.334 39.2813 24.7965 35.0834 34.0007 35.0834C43.2048 35.0834 50.6673 39.2813 50.6673 44.4584Z" fill="#DD9714"></path>
        </svg>
        <div class="reviews__item_box">
            <div class="reviews__item_name">' . htmlspecialchars($review['name']) . '</div>
            <div class="reviews__item_text">' . htmlspecialchars($review['text']) . '</div>
        </div>
    </div>
</div>
';}

echo json_encode([
    'status' => 'success',
    'html' => $html,
    'totalPages' => $totalPages
]);
?>