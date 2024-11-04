const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todo el inventario
router.get('/', async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM Inventario', []);
        res.json(results);
    } catch (err) {
        console.error('Error al obtener el inventario:', err);
        return res.status(500).json({ error: 'Error al obtener el inventario' });
    }
});

// Obtener inventario de un producto específico
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const results = await db.query('SELECT * FROM Inventario WHERE id_producto = @id', [{ name: 'id', type: db.sql.Int, value: id }]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado en inventario' });
        }
        res.json(results[0]);
    } catch (err) {
        console.error('Error al obtener el inventario del producto:', err);
        return res.status(500).json({ error: 'Error al obtener el inventario del producto' });
    }
});

// Crear una nueva entrada de inventario para un producto
router.post('/', async (req, res) => {
    const { id_producto, cantidad_disponible } = req.body;
    try {
        const result = await db.query('INSERT INTO Inventario (id_producto, cantidad_disponible) VALUES (@id_producto, @cantidad_disponible)', [
            { name: 'id_producto', type: db.sql.Int, value: id_producto },
            { name: 'cantidad_disponible', type: db.sql.Int, value: cantidad_disponible },
        ]);
        res.json({ id: result.rowsAffected[0], id_producto, cantidad_disponible });
    } catch (err) {
        console.error('Error al crear la entrada de inventario:', err);
        return res.status(500).json({ error: 'Error al crear la entrada de inventario' });
    }
});

// Actualizar la cantidad disponible de un producto en inventario
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { cantidad_disponible } = req.body;
    try {
        await db.query('UPDATE Inventario SET cantidad_disponible = @cantidad_disponible WHERE id_producto = @id', [
            { name: 'cantidad_disponible', type: db.sql.Int, value: cantidad_disponible },
            { name: 'id', type: db.sql.Int, value: id },
        ]);
        res.json({ message: 'Inventario actualizado' });
    } catch (err) {
        console.error('Error al actualizar el inventario:', err);
        return res.status(500).json({ error: 'Error al actualizar el inventario' });
    }
});

// Eliminar una entrada de inventario por ID de producto
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM Inventario WHERE id_producto = @id', [{ name: 'id', type: db.sql.Int, value: id }]);
        res.json({ message: 'Entrada de inventario eliminada' });
    } catch (err) {
        console.error('Error al eliminar la entrada de inventario:', err);
        return res.status(500).json({ error: 'Error al eliminar la entrada de inventario' });
    }
});

module.exports = router;
