document.addEventListener('DOMContentLoaded', function () {
    const content = document.getElementById('content');
    const links = document.querySelectorAll('.sidebar a');

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

    loadContent('reviews');
});