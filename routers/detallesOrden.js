const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los detalles de órdenes
router.get('/', async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM Detalles_de_la_orden');
        res.json(results);
    } catch (err) {
        console.error('Error al obtener los detalles de la orden:', err);
        return res.status(500).json({ error: 'Error al obtener los detalles de la orden' });
    }
});

// Crear un nuevo detalle de orden
router.post('/', async (req, res) => {
    const { id_orden, id_producto, cantidad, precio_unitario } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO Detalles_de_la_orden (id_orden, id_producto, cantidad, precio_unitario) VALUES (@id_orden, @id_producto, @cantidad, @precio_unitario)',
            { id_orden, id_producto, cantidad, precio_unitario }
        );
        res.json({ id: result.rowsAffected[0], id_orden, id_producto, cantidad, precio_unitario });
    } catch (err) {
        console.error('Error al crear el detalle de la orden:', err);
        return res.status(500).json({ error: 'Error al crear el detalle de la orden' });
    }
});

module.exports = router;
