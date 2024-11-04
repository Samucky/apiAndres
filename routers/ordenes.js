const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todas las órdenes
router.get('/', async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM Órdenes');
        res.json(results);
    } catch (err) {
        console.error('Error al obtener las órdenes:', err);
        return res.status(500).json({ error: 'Error al obtener las órdenes' });
    }
});

// Obtener una orden por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const results = await db.query('SELECT * FROM Ordenes WHERE id_orden = @id', { id });
        if (results.length === 0) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
        res.json(results[0]);
    } catch (err) {
        console.error('Error al obtener la orden:', err);
        return res.status(500).json({ error: 'Error al obtener la orden' });
    }
});


// Crear una nueva orden
// Crear un nuevo producto
router.post('/', async (req, res) => {
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    try {
        const query = `
            INSERT INTO Productos (nombre, descripcion, precio, stock, categoria)
            VALUES (@nombre, @descripcion, @precio, @stock, @categoria);
        `;

        const result = await db.query(query, [
            { name: 'nombre', type: db.sql.VarChar, value: nombre },
            { name: 'descripcion', type: db.sql.VarChar, value: descripcion },
            { name: 'precio', type: db.sql.Decimal, value: precio },
            { name: 'stock', type: db.sql.Int, value: stock },
            { name: 'categoria', type: db.sql.VarChar, value: categoria },
        ]);

        // Verificar si se afectaron filas
        if (result.rowsAffected[0] === 0) {
            return res.status(400).json({ error: 'No se pudo crear el producto' });
        }

        // Enviar respuesta de éxito
        res.status(201).json({ message: 'Producto creado exitosamente' });
    } catch (err) {
        console.error('Error al crear el producto:', err);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});



// Actualizar una orden por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { fecha, total, id_cliente } = req.body; 
    try {
        const query = `
            UPDATE Órdenes 
            SET fecha = @fecha, total = @total, id_cliente = @id_cliente
            WHERE id_orden = @id; 
        `;
        await db.query(query, [
            { name: 'fecha', type: db.sql.DateTime, value: fecha }, // Tipo correcto para fecha
            { name: 'total', type: db.sql.Decimal, value: total },   // Tipo correcto para total
            { name: 'id_cliente', type: db.sql.Int, value: id_cliente }, // ID del cliente
            { name: 'id', type: db.sql.Int, value: id } // ID de la orden a actualizar
        ]);
        res.json({ message: 'Orden actualizada', id, fecha, total, id_cliente });
    } catch (err) {
        console.error('Error al actualizar la orden:', err);
        return res.status(500).json({ error: 'Error al actualizar la orden' });
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params; // Obtiene el ID del cliente desde los parámetros de la URL
    try {
        // Consulta SQL para eliminar el cliente por I
        const query = 'DELETE FROM Órdenes WHERE id_orden = @id';

        // Asegúrate de pasar un array de parámetros
        await db.query(query, [{ name: 'id', type: db.sql.Int, value: id }]);

        // Devuelve una respuesta de éxito
        res.json({ message: 'orden eliminada' });
    } catch (err) {
        console.error('Error al eliminar el cliente:', err);
        // Devuelve un error 500 si ocurre un problema
        return res.status(500).json({ error: 'Error al eliminar el cliente' });
    }
});


module.exports = router;
