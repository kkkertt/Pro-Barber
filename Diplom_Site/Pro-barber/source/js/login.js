document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    if (!username || !password) {
        errorMessage.textContent = 'Пожалуйста, заполните все поля.';
        return;
    }

    fetch('/php/controllers/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'success') {
            window.location.href = result.redirect; 
        } else {
            errorMessage.textContent = result.message;
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        errorMessage.textContent = 'Произошла ошибка при входе.';
    });
});