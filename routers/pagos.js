const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los pagos
router.get('/', async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM Pagos');
        res.json(results);
    } catch (err) {
        console.error('Error al obtener los pagos:', err);
        return res.status(500).json({ error: 'Error al obtener los pagos' });
    }
});

// Obtener un pago por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const results = await db.query('SELECT * FROM Pagos WHERE id_pago = @id', { id });
        if (results.length === 0) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }
        res.json(results[0]);
    } catch (err) {
        console.error('Error al obtener el pago:', err);
        return res.status(500).json({ error: 'Error al obtener el pago' });
    }
});

// Crear un nuevo pago
router.post('/', async (req, res) => {
    const { monto, fecha, metodo, id_orden } = req.body;
    try {
        const result = await db.query('INSERT INTO Pagos (monto, fecha, metodo, id_orden) VALUES (@monto, @fecha, @metodo, @id_orden)', {
            monto,
            fecha,
            metodo,
            id_orden,
        });
        res.json({ id: result.rowsAffected[0], monto, fecha, metodo, id_orden });
    } catch (err) {
        console.error('Error al crear el pago:', err);
        return res.status(500).json({ error: 'Error al crear el pago' });
    }
});

// Actualizar un pago por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { monto, fecha, metodo, id_orden } = req.body;
    try {
        await db.query('UPDATE Pagos SET monto = @monto, fecha = @fecha, metodo = @metodo, id_orden = @id_orden WHERE id_pago = @id', {
            monto,
            fecha,
            metodo,
            id_orden,
            id,
        });
        res.json({ message: 'Pago actualizado' });
    } catch (err) {
        console.error('Error al actualizar el pago:', err);
        return res.status(500).json({ error: 'Error al actualizar el pago' });
    }
});

// Eliminar un pago por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM Pagos WHERE id_pago = @id', { id });
        res.json({ message: 'Pago eliminado' });
    } catch (err) {
        console.error('Error al eliminar el pago:', err);
        return res.status(500).json({ error: 'Error al eliminar el pago' });
    }
});

module.exports = router;
