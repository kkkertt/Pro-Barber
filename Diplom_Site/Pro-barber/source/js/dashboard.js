document.addEventListener('DOMContentLoaded', function () {
	const content = document.getElementById('content');
	const links = document.querySelectorAll('.sidebar a');
	const messageContainer = document.getElementById('message');

	// Функция для отображения сообщений
	function showMessage(text, type = 'success') {
			messageContainer.textContent = text;
			messageContainer.className = `message ${type}`;
			messageContainer.style.display = 'block';
			// Скрыть сообщение через 3 секунды
			setTimeout(() => {
					messageContainer.style.display = 'none';
			}, 3000);
	}

	// Функция для загрузки контента
	function loadContent(page, pageNumber = 1) {
			fetch(`/php/admin/${page}.php?page=${pageNumber}`)
					.then(response => {
							if (!response.ok) {
									throw new Error('Network response was not ok');
							}
							return response.json();
					})
					.then(data => {
							if (data.status === 'success') {
									content.innerHTML = data.html;
									setupPagination(data.totalPages, page, pageNumber);
							} else {
									content.innerHTML = `<p>${data.message}</p>`;
							}
					})
					.catch(error => {
							console.error('Ошибка:', error);
							content.innerHTML = '<p>Произошла ошибка при загрузке данных.</p>';
					});
	}

	// Настройка пагинации
	function setupPagination(totalPages, currentPage, currentNumber) {
			const pagination = document.createElement('div');
			pagination.className = 'pagination';
			for (let i = 1; i <= totalPages; i++) {
					const button = document.createElement('button');
					button.textContent = i;
					button.disabled = i === currentNumber;
					button.addEventListener('click', () => loadContent(currentPage, i));
					pagination.appendChild(button);
			}
			content.appendChild(pagination);
	}

	// Обработка кликов на ссылки в боковом меню
	links.forEach(link => {
			link.addEventListener('click', function (e) {
					e.preventDefault();
					const page = this.getAttribute('data-page');
					if (page === 'home') {
							window.location.href = '/index.html';
					} else {
							loadContent(page);
					}
			});
	});

	// Обработка кликов внутри контента
	content.addEventListener('click', function (e) {
			// Удаление элемента (отзывы, бронирования или услуги)
			if (e.target.classList.contains('delete-btn')) {
					const id = e.target.getAttribute('data-id');
					const type = e.target.getAttribute('data-type');
					let url = '';

					if (type === 'review') {
							url = '/php/controllers/delete_review.php';
					} else if (type === 'booking') {
							url = '/php/controllers/delete_booking.php';
					} else if (type === 'service') {
							url = '/php/controllers/delete_service.php';
					}

					fetch(url, {
							method: 'POST',
							headers: {
									'Content-Type': 'application/json'
							},
							body: JSON.stringify({ id: id })
					})
					.then(response => response.json())
					.then(data => {
							if (data.status === 'success') {
									const elementToRemove = e.target.closest(`.${type === 'review' ? 'reviews__item' : type === 'booking' ? 'request' : 'services__item'}`);
									if (elementToRemove) {
											elementToRemove.remove();
											showMessage(`Элемент (${type}) успешно удален.`, 'success');
									} else {
											console.error(`Элемент с классом .${type === 'review' ? 'reviews__item' : type === 'booking' ? 'request' : 'services__item'} не найден.`);
											showMessage(`Ошибка: элемент (${type}) не найден.`, 'error');
									}
							} else {
									showMessage(`Ошибка при удалении элемента (${type}): ${data.message}`, 'error');
							}
					})
					.catch(error => {
							console.error('Ошибка:', error);
							showMessage('Произошла ошибка при удалении элемента.', 'error');
					});
			}
	});

	// Загрузка начального контента
	loadContent('reviews');
});