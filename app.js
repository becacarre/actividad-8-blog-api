
const express = require('express');
const db = require('./config/db');
const rutasAutores = require('./routes/autores');
const rutasPosts = require('./routes/posts');

const app = express();
const PORT = 3000;

// Permite recibir datos en formato JSON
app.use(express.json());

// Ruta para comprobar que la API funciona
app.get('/api', (req, res) => {
    res.json({ mensaje: 'API del blog funcionando correctamente' });
});

// Rutas de autores
app.use('/api/autores', rutasAutores);

// Rutas de posts
app.use('/api/posts', rutasPosts);

// Comprobamos la conexion con MySQL
async function comprobarConexion() {
    try {
        const conexion = await db.getConnection();
        console.log('Conexion con MySQL correcta');
        conexion.release();
    } catch (error) {
        console.log('Error al conectar con MySQL:', error.message);
    }
}

// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
    comprobarConexion();
});
