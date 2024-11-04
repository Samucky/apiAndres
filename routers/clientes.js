const express = require('express');
const router = express.Router();
const db = require('../db'); // Asegúrate de que el archivo 'db.js' exporte correctamente 'sql' y 'query'

// Obtener todos los clientes
router.get('/', async (req, res) => {
    try {
        const results = await db.query('SELECT * FROM Clientes');
        res.json(results);
    } catch (err) {
        console.error('Error al obtener los clientes:', err);
        return res.status(500).json({ error: 'Error al obtener los clientes' });
    }
});


// Crear un nuevo cliente
router.post('/', async (req, res) => {
    const cliente = req.body;
    try {
        const query = `
            INSERT INTO Clientes (nombre, email, teléfono, dirección)
            VALUES ( @nombre, @correo, @telefono, @direccion);
        `;
        const result = await db.query(query, [
            { name: 'nombre', type: db.sql.VarChar, value: cliente.nombre },
            { name: 'correo', type: db.sql.VarChar, value: cliente.email },
            { name: 'telefono', type: db.sql.VarChar, value: cliente.telefono },
            { name: 'direccion', type: db.sql.VarChar, value: cliente.direccion }
        ]);
        res.status(201).json({ message: 'Cliente creado exitosamente', result });
    } catch (err) {
        console.error('Error al crear el cliente:', err);
        res.status(500).json({ error: 'Error al crear el cliente' });
    }
});

// Actualizar un cliente por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params; // Obtener el ID de la orden a actualizar
    const { fecha, total, id_cliente } = req.body; // Obtener nuevos datos para la orden
    try {
        const query = `
            UPDATE Órdenes 
            SET fecha = @fecha, total = @total, id_cliente = @id_cliente
            WHERE id_orden = @id; // Asegúrate de que este sea el nombre correcto de la columna de ID
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
        // Consulta SQL para eliminar el cliente por ID
        const query = 'DELETE FROM Clientes WHERE id_cliente = @id';
        
        // Ejecuta la consulta utilizando el ID como parámetro
        await db.query(query, [{ name: 'id', type: db.sql.Int, value: id }]);

        // Devuelve una respuesta de éxito
        res.json({ message: 'Cliente eliminado' });
    } catch (err) {
        console.error('Error al eliminar el cliente:', err);
        // Devuelve un error 500 si ocurre un problema
        return res.status(500).json({ error: 'Error al eliminar el cliente' });
    }
});


module.exports = router;
