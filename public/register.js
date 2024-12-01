document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            alert('Usuario registrado exitosamente');
            window.location.href = 'login.html'; // Redirige al login
        } else {
            const errorText = await response.text();
            alert(`Error: error en el servidor`);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un problema con el servidor');
    }
});
