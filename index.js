require('dotenv').config(); // Cargar las variables de entorno
const express = require('express');
const app = express();
const clientesRouter = require('./routers/clientes');
const ordenesRouter = require('./routers/ordenes');
const detallesOrdenRouter = require('./routers/detallesOrden');
const productosRouter = require('./routers/productos');
const pagosRouter = require('./routers/pagos');
const enviosRouter = require('./routers/envios');

// Middleware para analizar JSON
app.use(express.json());

// Configuración de routers
app.use('/clientes', clientesRouter);
app.use('/ordenes', ordenesRouter);
app.use('/detallesOrden', detallesOrdenRouter);
app.use('/productos', productosRouter);
app.use('/pagos', pagosRouter);
app.use('/envios', enviosRouter);

// Puerto del servidor
const PORT = process.env.PORT || 3000; // Usar el puerto definido en el .env
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
