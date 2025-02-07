document.addEventListener('DOMContentLoaded', function () {
	function createModal() {
		const modal = document.createElement('div');
		modal.id = 'modal';
		modal.className = 'modal';
		modal.style.display = 'none';

		modal.innerHTML = `
				<div class="modal-content">
						<span class="close-modal" id="close-modal">×</span>
						<h2>Редактирование услуги</h2>
						<form id="edit-service-form">
								<input type="hidden" id="service-id" name="id">
								<label for="name">Название:</label>
								<input type="text" id="name" name="name" required><br>
								<label for="price">Цена:</label>
								<input type="number" id="price" name="price" required><br>
								<label for="description">Описание:</label>
								<textarea id="description" name="description" required></textarea><br>
								<label for="image_url">URL изображения:</label>
								<input type="text" id="image_url" name="image_url" required><br>
								<button type="submit">Сохранить изменения</button>
						</form>
				</div>
		`;

		document.body.appendChild(modal);
}
let modal = document.getElementById('modal');
if (!modal) {
		createModal();
		modal = document.getElementById('modal');
}

const closeModalButton = document.getElementById('close-modal');
const editForm = document.getElementById('edit-service-form');

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

const content = document.getElementById('content');
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
});