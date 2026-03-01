require('dotenv').config();
const app = require('./app');
const errorMiddleware = require('./middlewares/error.middleware');

const PORT = process.env.PORT || 3000;

// Registrar middleware de errores **antes** de levantar el servidor
app.use(errorMiddleware);

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});