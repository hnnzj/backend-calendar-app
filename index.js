const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const port = process.env.PORT;

//Crear el servidor de express
const app = express();

//Database
dbConnection();

//Lectura y parseo del body

app.use(express.json());

//CORS
app.use(cors());

//Directorio publico

app.use(express.static('public'));

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
//TODO: CRUD:Eventos

//Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
