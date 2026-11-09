# Actividad 8 - API de Blog con Express y MySQL

En esta actividad he creado una API para gestionar los posts de un blog y sus autores utilizando Express y MySQL.

La base de datos `actividad8_blog` contiene dos tablas, `autores` y `posts`, relacionadas mediante el campo `autor_id`.

## Rutas de la API

- `GET /api/autores` - Obtener todos los autores.
- `POST /api/autores` - Crear un nuevo autor.
- `GET /api/posts` - Obtener todos los posts con los datos de sus autores.
- `POST /api/posts` - Crear un nuevo post.
- `GET /api/autores/:id/posts` - Obtener los posts de un autor concreto.

He añadido validaciones para comprobar los campos obligatorios, el formato del email y que los autores indicados existan en la base de datos.

Las peticiones se han probado utilizando Thunder Client.

El archivo blog.sql contiene la estructura de las tablas y algunos datos de ejemplo exportados desde MySQL Workbench