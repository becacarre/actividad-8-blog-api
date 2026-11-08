
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

    try {
        const [resultado] = await db.query(
            'INSERT INTO autores (nombre, email, imagen) VALUES (?, ?, ?)',
            [nombre.trim(), email.trim(), imagen || null]
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

module.exports = router;
