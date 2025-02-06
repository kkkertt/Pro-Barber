document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("rModal");
    const addReviewBtn = document.querySelector(".modal__btn_add");
    const reviewsContainer = document.getElementById("reviewsContainer");

	function checkBlocksVisibility() {
		let windowHeight = window.innerHeight;
        document.querySelectorAll('.view').forEach(block => {
            let blockPosition = block.getBoundingClientRect().top;
            if (blockPosition < windowHeight - 50) {
                block.style.opacity = "1";
                block.style.transform = "translateY(0)";
            }
        });
	  }
      
	function showNotification(message, type = "success") {
		const notification = document.createElement("div");
		notification.className = `notification ${type}`;
		notification.textContent = message;

		document.body.appendChild(notification);

		setTimeout(() => {
			notification.classList.add("show");
		}, 10);

		setTimeout(() => {
			notification.classList.remove("show");
			setTimeout(() => {
				document.body.removeChild(notification);
			}, 300);
		}, 5000);
	}

    addReviewBtn.addEventListener("click", function () {
        const nameInput = modal
            .querySelector('.modal__input[placeholder="Ваше имя"]')
            .value.trim();
        const textInput = modal
            .querySelector('.modal__input[placeholder="Текст отзыва"]')
            .value.trim();

        if (!nameInput || !textInput) {
            showNotification("Пожалуйста, заполните все поля.", "error");
            return;
        }

        fetch("/php/controllers/add_review.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: nameInput, text: textInput }),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === "success") {
                    showNotification("Отзыв успешно добавлен!", "success");
                    modal.style.display = "none";
                    loadReviews();
                } else {
                    showNotification(`Ошибка: ${result.message}`, "error");
                }
            })
            .catch((error) => {
                console.error("Ошибка:", error);
                showNotification("Произошла ошибка при добавлении отзыва.", "error");
            });
    });

    function loadReviews() {
        fetch("/php/controllers/get_reviews.php")
            .then((response) => response.json())
            .then((result) => {
                if (result.status === "success") {
                    const reviews = result.reviews;
                    reviewsContainer.innerHTML = "";
                    reviews.forEach((review) => {
                        const reviewHTML = `
                            <div class="reviews__item view">
                                <svg class="reviews__item_svg" width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="34" cy="34" r="32.5" stroke="#DD9714" stroke-width="3" />
                                    <path d="M33.9993 28.8333C38.6017 28.8333 42.3327 25.1023 42.3327 20.5C42.3327 15.8976 38.6017 12.1666 33.9993 12.1666C29.397 12.1666 25.666 15.8976 25.666 20.5C25.666 25.1023 29.397 28.8333 33.9993 28.8333Z" fill="#DD9714" />
                                    <path d="M50.6673 44.4584C50.6673 49.6355 50.6673 53.8334 34.0007 53.8334C17.334 53.8334 17.334 49.6355 17.334 44.4584C17.334 39.2813 24.7965 35.0834 34.0007 35.0834C43.2048 35.0834 50.6673 39.2813 50.6673 44.4584Z" fill="#DD9714" />
                                </svg>
                                <div class="reviews__item_box">
                                    <div class="reviews__item_name">${review.name}</div>
                                    <div class="reviews__item_text">${review.text}</div>
                                </div>
                            </div>
                        `;
                        reviewsContainer.insertAdjacentHTML("beforeend", reviewHTML);
                    });
                    checkBlocksVisibility();
					window.addEventListener('scroll', checkBlocksVisibility);
                } else {
                    console.error("Ошибка загрузки отзывов:", result.message);
                }
            })
            .catch((error) => {
                console.error("Ошибка:", error);
            });
    }

    loadReviews();
});