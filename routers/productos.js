const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM Productos');
        res.json(results);
    } catch (err) {
        console.error('Error al obtener los productos:', err);
        return res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const results = await db.query('SELECT * FROM Productos WHERE id_producto = @id', [
            { name: 'id', type: db.sql.Int, value: id }
        ]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(results[0]);
    } catch (err) {
        console.error('Error al obtener el producto:', err);
        return res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Crear un nuevo producto
// Crear un nuevo producto
router.post('/', async (req, res) => {
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    try {
        const query = `
            INSERT INTO Productos (nombre, descripción, precio, stock, categoría)
            VALUES (@nombre, @descripcion, @precio, @stock, @categoria);
        `;

        // Realizar la consulta
        await db.query(query, [
            { name: 'nombre', type: db.sql.VarChar, value: nombre },
            { name: 'descripcion', type: db.sql.VarChar, value: descripcion },
            { name: 'precio', type: db.sql.Decimal, value: precio },
            { name: 'stock', type: db.sql.Int, value: stock },
            { name: 'categoria', type: db.sql.VarChar, value: categoria },
        ]);

        // Enviar respuesta de éxito
        res.status(201).json({ message: 'Producto creado exitosamente' });
    } catch (err) {
        console.error('Error al crear el producto:', err);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});


// Actualizar un producto por ID
// Actualizar un producto por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    try {
        const query = `
            UPDATE Productos
            SET nombre = @nombre,
                descripción = @descripcion,
                precio = @precio,
                stock = @stock,
                categoría = @categoria
            WHERE id_producto = @id;
        `;

        // Realizar la consulta
        await db.query(query, [
            { name: 'nombre', type: db.sql.VarChar, value: nombre },
            { name: 'descripcion', type: db.sql.VarChar, value: descripcion },
            { name: 'precio', type: db.sql.Decimal, value: precio }, // Cambiado a Decimal si es necesario
            { name: 'stock', type: db.sql.Int, value: stock },
            { name: 'categoria', type: db.sql.VarChar, value: categoria },
            { name: 'id', type: db.sql.Int, value: id },
        ]);

        // Enviar respuesta de éxito
        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (err) {
        console.error('Error al actualizar el producto:', err);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});


// Eliminar un producto por ID
// Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Eliminar registros relacionados en Inventario
        await db.query('DELETE FROM Inventario WHERE id_producto = @id', [
            { name: 'id', type: db.sql.Int, value: id }
        ]);

        // Eliminar el producto
        await db.query('DELETE FROM Productos WHERE id_producto = @id', [
            { name: 'id', type: db.sql.Int, value: id }
        ]);

        // Enviar respuesta de éxito
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar el producto:', err);
        return res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;
