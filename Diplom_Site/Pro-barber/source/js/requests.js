document.addEventListener('DOMContentLoaded', function () {
	const content = document.getElementById('content');

	content.addEventListener('change', function (e) {
			if (e.target.classList.contains('status-select')) {
					const bookingId = e.target.getAttribute('data-id');
					const newStatus = e.target.value;

					fetch('/php/controllers/update_status.php', {
							method: 'POST',
							headers: {
									'Content-Type': 'application/json'
							},
							body: JSON.stringify({ id: bookingId, status: newStatus })
					})
					.then(response => response.json())
					.then(data => {
							if (data.status === 'success') {
									alert('Статус успешно обновлен.');
							} else {
									alert('Ошибка при обновлении статуса: ' + data.message);
							}
					})
					.catch(error => {
							console.error('Ошибка:', error);
							alert('Произошла ошибка при обновлении статуса.');
					});
			}
	});
});