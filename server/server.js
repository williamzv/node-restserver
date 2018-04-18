require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');


// Middleware: cada peticion que se realice siempre van a pasar por los middleware:
// se identican porque inician con un app.use(...)
// parse application/x-www-form-urlenconded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// Configuración global de rutas
app.use(require('./routes/index.js'));

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando en puerto: ', process.env.PORT);
});