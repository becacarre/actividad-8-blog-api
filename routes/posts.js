
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Recuperamos todos los posts con los datos de sus autores
router.get('/', async (req, res) => {
    try {
        const [posts] = await db.query(`
            SELECT posts.id, posts.titulo, posts.descripcion,
                   posts.fecha_creacion, posts.categoria,
                   autores.id AS autor_id, autores.nombre AS autor_nombre,
                   autores.email AS autor_email, autores.imagen AS autor_imagen
            FROM posts
            JOIN autores ON posts.autor_id = autores.id
        `);

        res.json(posts);
    } catch (error) {
        console.log('Error al obtener los posts:', error.message);
        res.status(500).json({ mensaje: 'Error al obtener los posts' });
    }
});

// Creamos un nuevo post
router.post('/', async (req, res) => {
    const { titulo, descripcion, categoria, autor_id } = req.body;

    // Comprobamos que los campos obligatorios tengan contenido
    if (typeof titulo !== 'string' || typeof descripcion !== 'string' ||
        typeof categoria !== 'string' || !titulo.trim() ||
        !descripcion.trim() || !categoria.trim() || !Number.isInteger(autor_id) ||
        autor_id <= 0) {
        return res.status(400).json({ mensaje: 'Los datos del post no son validos' });
    }

    try {
        // Comprobamos que el autor exista
        const [autores] = await db.query(
            'SELECT id FROM autores WHERE id = ?',
            [autor_id]
        );

        if (autores.length === 0) {
            return res.status(404).json({ mensaje: 'El autor no existe' });
        }

        // Guardamos el nuevo post
        const [resultado] = await db.query(
            'INSERT INTO posts (titulo, descripcion, categoria, autor_id) VALUES (?, ?, ?, ?)',
            [titulo.trim(), descripcion.trim(), categoria.trim(), autor_id]
        );

        res.status(201).json({
            mensaje: 'Post creado correctamente',
            id: resultado.insertId
        });

    } catch (error) {
        console.log('Error al crear el post:', error.message);
        res.status(500).json({ mensaje: 'Error al crear el post' });
    }
});

module.exports = router;
