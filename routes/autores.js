
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Recuperamos todos los autores de la base de datos
router.get('/', async (req, res) => {
    try {
        const [autores] = await db.query('SELECT * FROM autores');
        res.json(autores);
    } catch (error) {
        console.log('Error al obtener los autores:', error.message);
        res.status(500).json({ mensaje: 'Error al obtener los autores' });
    }
});

// Creamos un nuevo autor
router.post('/', async (req, res) => {
    const { nombre, email, imagen } = req.body;

    // Comprobamos que el nombre y el email no esten vacios
    if (typeof nombre !== 'string' || typeof email !== 'string' ||
        !nombre.trim() || !email.trim()) {
        return res.status(400).json({ mensaje: 'El nombre y el email son obligatorios' });
    }

    // Comprobamos que el email tenga un formato valido
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email.trim())) {
        return res.status(400).json({ mensaje: 'El email no es valido' });
    }

    // Si hay una imagen, comprobamos que sea una URL valida
    if (imagen != null && imagen !== '') {
        if (typeof imagen !== 'string' ||
            !/^https?:\/\/\S+\.\S+$/i.test(imagen.trim())) {
            return res.status(400).json({ mensaje: 'La URL de la imagen no es valida' });
        }
    }

    try {
        const [resultado] = await db.query(
            'INSERT INTO autores (nombre, email, imagen) VALUES (?, ?, ?)',
            [nombre.trim(), email.trim(),
             typeof imagen === 'string' ? imagen.trim() || null : null]
        );

        res.status(201).json({
            mensaje: 'Autor creado correctamente',
            id: resultado.insertId
        });

    } catch (error) {
        // Controlamos si el email ya existe
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ mensaje: 'Ya existe un autor con ese email' });
        }

        console.log('Error al crear el autor:', error.message);
        res.status(500).json({ mensaje: 'Error al crear el autor' });
    }
});

// Recuperamos los posts de un autor concreto
router.get('/:id/posts', async (req, res) => {
    const id = Number(req.params.id);

    // Comprobamos que el ID del autor sea valido
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ mensaje: 'El ID del autor no es valido' });
    }

    try {
        // Comprobamos que el autor exista
        const [autores] = await db.query(
            'SELECT * FROM autores WHERE id = ?',
            [id]
        );

        if (autores.length === 0) {
            return res.status(404).json({ mensaje: 'El autor no existe' });
        }

        // Recuperamos todas las publicaciones de ese autor
        const [posts] = await db.query(`
            SELECT posts.id, posts.titulo, posts.descripcion,
                   posts.fecha_creacion, posts.categoria,
                   autores.id AS autor_id, autores.nombre AS autor_nombre,
                   autores.email AS autor_email, autores.imagen AS autor_imagen
            FROM posts
            JOIN autores ON posts.autor_id = autores.id
            WHERE autores.id = ?
        `, [id]);

        res.json(posts);

    } catch (error) {
        console.log('Error al obtener los posts del autor:', error.message);
        res.status(500).json({ mensaje: 'Error al obtener los posts del autor' });
    }
});

module.exports = router;
