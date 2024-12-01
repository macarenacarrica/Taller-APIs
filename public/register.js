document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Asegúrate de que el tipo de contenido sea JSON
            },
            body: JSON.stringify({ username, password }) // Envia los datos como JSON
        });

        if (response.ok) {
            alert('Usuario registrado exitosamente');
            window.location.href = 'login.html'; // Redirige al login
        } else {
            const errorText = await response.text();
            alert(`Error: ${errorText}`); // Muestra el error recibido
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un problema con el servidor');
    }
});
