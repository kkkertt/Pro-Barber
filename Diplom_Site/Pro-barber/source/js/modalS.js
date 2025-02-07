const btn = document.querySelector('.btn-call');
const modal = document.getElementById('sModal');
const closeBtn = document.querySelector('.modal__btn_close');

// Функция для открытия модального окна
function openModal() {
    modal.style.display = 'block';
    document.body.classList.add('_lock'); // Блокируем прокрутку страницы
}

// Функция для закрытия модального окна
function closeModal() {
    modal.style.display = 'none';
    document.body.classList.remove('_lock'); // Разблокируем прокрутку страницы
    modal.querySelector('form').reset(); // Очищаем форму при закрытии
}

// Открытие модального окна при нажатии на кнопку "Записаться"
btn.addEventListener('click', openModal);

// Закрытие модального окна при клике на кнопку "Закрыть"
closeBtn.addEventListener('click', closeModal);

// Закрытие модального окна при клике вне области окна
window.onclick = function (e) {
    if (e.target === modal) {
        closeModal();
    }
};

document.addEventListener('DOMContentLoaded', function () {
	const phoneInput = modal.querySelector('[placeholder="Номер телефона"]');
	const notification = document.getElementById('notification');

	// Форматирование номера телефона
	phoneInput.addEventListener('input', function () {
			let value = this.value.replace(/\D/g, '');
			if (value.startsWith('7')) {
					value = value.slice(1);
			}
			if (value.length > 10) {
					value = value.slice(0, 10);
			}
			let formattedValue = '+7 (';
			if (value.length >= 3) {
					formattedValue += value.slice(0, 3) + ') ';
			} else {
					formattedValue += value.padEnd(3, '_') + ') ';
			}
			if (value.length >= 6) {
					formattedValue += value.slice(3, 6);
			} else if (value.length > 3) {
					formattedValue += value.slice(3).padEnd(3, '_');
			} else {
					formattedValue += '___';
			}
			formattedValue += '-';
			if (value.length >= 8) {
					formattedValue += value.slice(6, 8);
			} else if (value.length > 6) {
					formattedValue += value.slice(6).padEnd(2, '_');
			} else {
					formattedValue += '__';
			}
			formattedValue += '-';
			if (value.length >= 10) {
					formattedValue += value.slice(8, 10);
			} else if (value.length > 8) {
					formattedValue += value.slice(8).padEnd(2, '_');
			} else {
					formattedValue += '__';
			}
			this.value = formattedValue;
	});

	// Функция для показа уведомлений
	function showNotification(message, type) {
			notification.textContent = message;
			notification.className = `notification ${type}`;
			notification.style.display = 'block';
			setTimeout(() => {
					notification.style.display = 'none';
			}, 7000);
	}

	// Обработчик отправки формы
	modal.querySelector('form').addEventListener('submit', function (event) {
			event.preventDefault();

			const name = modal.querySelector('[placeholder="Имя"]').value.trim();
			const phone = modal.querySelector('[placeholder="Номер телефона"]').value.trim();
			const agreement = modal.querySelector('#toggleCheckbox').checked ? 'on' : '';

			// Валидация имени
			if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(name)) {
					showNotification('Имя должно содержать только буквы.', 'error');
					return;
			}

			// Валидация телефона
			const phonePattern = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
			if (!phonePattern.test(phone)) {
					showNotification('Неверный формат телефона. Пример: +7 (999) 123-45-67', 'error');
					return;
			}

			// Проверка согласия
			if (!agreement) {
					showNotification('Необходимо согласиться с политикой обработки данных.', 'error');
					return;
			}

			// Отправка данных на сервер
			fetch('/php/controllers/save_booking.php', {
					method: 'POST',
					headers: {
							'Content-Type': 'application/json'
					},
					body: JSON.stringify({ name, phone, agreement })
			})
			.then(response => {
					if (!response.ok) {
							throw new Error('Network response was not ok');
					}
					return response.json();
			})
			.then(result => {
					if (result.status === 'success') {
							showNotification('Спасибо! Ваша заявка успешно отправлена.', 'success');
							closeModal(); // Закрываем модальное окно
					} else {
							showNotification(`Произошла ошибка: ${result.message}`, 'error');
					}
			})
			.catch(error => {
					console.error('Ошибка:', error);
					showNotification('Произошла ошибка при отправке данных.', 'error');
			});
	});
});