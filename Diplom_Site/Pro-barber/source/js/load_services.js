document.addEventListener("DOMContentLoaded", function () {
  const servicesContainer = document.getElementById("services-container");

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

  function loadServices() {
    fetch("/php/controllers/get_services.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          renderServices(data.services);
        } else {
          console.error("Ошибка:", data.message);
          servicesContainer.innerHTML =
            "<p>Произошла ошибка при загрузке услуг.</p>";
        }
      })
      .catch((error) => {
        console.error("Ошибка:", error);
        servicesContainer.innerHTML =
          "<p>Произошла ошибка при загрузке услуг.</p>";
      });
  }

  function renderServices(services) {
    let html = "";
    services.forEach((service) => {
      html += `
							<div class="services__item view">
									<img src="${service.image_url}" alt="${service.name}" class="services__item_img">
									<div class="services__item_body">
											<div class="services__item_body-top">
													<h3 class="services__body_name">${service.name}</h3>
													<p class="services__body_price">${service.price} <span class="services__body_price-ruble">₽</span></p>
											</div>
											<div class="services__item_body-line"></div>
											<p class="services__body_text">${service.description}</p>
									</div>
							</div>
					`;
    });
		checkBlocksVisibility();
					window.addEventListener('scroll', checkBlocksVisibility);
    servicesContainer.innerHTML = html;
  }
  loadServices();
});
