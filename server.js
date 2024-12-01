const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const PORT = 3000; // Cambiado a 3000 para evitar conflictos con el puerto de MySQL

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'clave-secreta',
    resave: false,
    saveUninitialized: true
}));

// Conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '12345', 
    database: 'cocktails'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos MySQL/MariaDB');
    }
});

// Ruta de prueba
app.get('/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) {
            return res.status(500).send('Error conectando a la base de datos');
        }
        res.send(`Conexión exitosa: Resultado = ${results[0].solution}`);
    });
});

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Faltan datos: usuario o contraseña');
    }

    // Cifra la contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Inserta el usuario en la base de datos
    db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.status(400).send('El usuario ya existe');
                } else {
                    console.error(err);
                    res.status(500).send('Error en el servidor');
                }
            } else {
                res.send('Usuario registrado exitosamente');
            }
        }
    );
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Faltan datos: usuario o contraseña');
    }

    // Busca al usuario en la base de datos
    db.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error en el servidor');
            } else if (results.length > 0) {
                const user = results[0];

                // Verifica la contraseña
                if (bcrypt.compareSync(password, user.password)) {
                    req.session.user = user; // Guarda al usuario en la sesión
                    res.send('Inicio de sesión exitoso');
                } else {
                    res.status(401).send('Contraseña incorrecta');
                }
            } else {
                res.status(404).send('Usuario no encontrado');
            }
        }
    );
});

// Middleware para proteger rutas
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send('Acceso no autorizado');
    }
}

// Ruta principal protegida
app.get('/', isAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
