document.addEventListener('DOMContentLoaded', function () {
	const content = document.getElementById('content');
	const modal = document.getElementById('modal');
	const closeModalButton = document.getElementById('close-modal');
	const editForm = document.getElementById('edit-service-form');

	if (!content || !modal || !closeModalButton || !editForm) {
			console.error('Один или несколько ключевых элементов не найдены в DOM!');
			return;
	}

	/**
	 * Открывает модальное окно и заполняет форму данными услуги.
	 * @param {Object} serviceData - Данные услуги для редактирования.
	 */
	function openModal(serviceData) {
			const inputs = {
					'service-id': serviceData.id,
					'name': serviceData.name,
					'price': serviceData.price,
					'description': serviceData.description,
					'image_url': serviceData.image_url
			};

			for (const [id, value] of Object.entries(inputs)) {
					const inputElement = document.getElementById(id);
					if (!inputElement) {
							console.error(`Элемент с ID "${id}" не найден!`);
							return;
					}
					inputElement.value = value;
			}

			modal.style.display = 'block';
	}

	function closeModal() {
			modal.style.display = 'none';
	}

	closeModalButton.addEventListener('click', closeModal);

	window.addEventListener('click', function (e) {
			if (e.target === modal) {
					closeModal();
			}
	});

	content.addEventListener('click', function (e) {
			if (e.target.classList.contains('edit-btn')) {
					const serviceId = e.target.getAttribute('data-id');

					fetch(`/php/controllers/get_service.php?id=${serviceId}`)
							.then(response => {
									if (!response.ok) {
											throw new Error('Network response was not ok');
									}
									return response.json();
							})
							.then(data => {
									if (data.status === 'success') {
											openModal(data.service);
									} else {
											alert(`Ошибка при загрузке данных услуги: ${data.message}`);
									}
							})
							.catch(error => {
									console.error('Ошибка:', error);
									alert('Произошла ошибка при загрузке данных услуги.');
							});
			}
	});

	editForm.addEventListener('submit', function (e) {
			e.preventDefault();

			const formData = new FormData(editForm);
			const jsonData = {};
			formData.forEach((value, key) => {
					jsonData[key] = value;
			});

			fetch('/php/controllers/edit_service.php', {
					method: 'POST',
					headers: {
							'Content-Type': 'application/json'
					},
					body: JSON.stringify(jsonData)
			})
			.then(response => {
					if (!response.ok) {
							throw new Error('Network response was not ok');
					}
					return response.json();
			})
			.then(data => {
					if (data.status === 'success') {
							closeModal();
							location.reload();
					} else {
							alert(`Ошибка при сохранении изменений: ${data.message}`);
					}
			})
			.catch(error => {
					console.error('Ошибка:', error);
					alert('Произошла ошибка при сохранении изменений.');
			});
	});

	content.addEventListener('click', function (e) {
			if (e.target.classList.contains('delete-btn')) {
					const serviceId = e.target.getAttribute('data-id');

					fetch('/php/controllers/delete_service.php', {
							method: 'POST',
							headers: {
									'Content-Type': 'application/json'
							},
							body: JSON.stringify({ id: serviceId })
					})
					.then(response => {
							if (!response.ok) {
									throw new Error('Network response was not ok');
							}
							return response.json();
					})
					.then(data => {
							if (data.status === 'success') {
									e.target.closest('.services__item').remove();
									alert('Услуга успешно удалена.');
							} else {
									alert(`Ошибка при удалении услуги: ${data.message}`);
							}
					})
					.catch(error => {
							console.error('Ошибка:', error.message);
							alert('Произошла ошибка при удалении услуги.');
					});
			}
	});
});