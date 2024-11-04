const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los envíos
router.get('/', async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM Envios');
        res.json(results);
    } catch (err) {
        console.error('Error al obtener los envíos:', err);
        return res.status(500).json({ error: 'Error al obtener los envíos' });
    }
});

// Obtener un envío por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const results = await db.query('SELECT * FROM Envios WHERE id_envio = @id', { id });
        if (results.length === 0) {
            return res.status(404).json({ error: 'Envío no encontrado' });
        }
        res.json(results[0]);
    } catch (err) {
        console.error('Error al obtener el envío:', err);
        return res.status(500).json({ error: 'Error al obtener el envío' });
    }
});

// Crear un nuevo envío
router.post('/', async (req, res) => {
    const { fecha_envio, direccion_envio, estado, id_orden } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO Envios (fecha_envio, direccion_envio, estado, id_orden) VALUES (@fecha_envio, @direccion_envio, @estado, @id_orden)',
            { fecha_envio, direccion_envio, estado, id_orden }
        );
        res.json({ id: result.rowsAffected[0], fecha_envio, direccion_envio, estado, id_orden });
    } catch (err) {
        console.error('Error al crear el envío:', err);
        return res.status(500).json({ error: 'Error al crear el envío' });
    }
});

// Actualizar un envío por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { fecha_envio, direccion_envio, estado, id_orden } = req.body;
    try {
        await db.query(
            'UPDATE Envios SET fecha_envio = @fecha_envio, direccion_envio = @direccion_envio, estado = @estado, id_orden = @id_orden WHERE id_envio = @id',
            { fecha_envio, direccion_envio, estado, id_orden, id }
        );
        res.json({ message: 'Envío actualizado' });
    } catch (err) {
        console.error('Error al actualizar el envío:', err);
        return res.status(500).json({ error: 'Error al actualizar el envío' });
    }
});

// Eliminar un envío por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM Envios WHERE id_envio = @id', { id });
        res.json({ message: 'Envío eliminado' });
    } catch (err) {
        console.error('Error al eliminar el envío:', err);
        return res.status(500).json({ error: 'Error al eliminar el envío' });
    }
});

module.exports = router;
