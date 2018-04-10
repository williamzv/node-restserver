require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// Middleware: cada peticion que se realice siempre van a pasar por los middleware:
// se identican porque inician con un app.use(...)
// parse application/x-www-form-urlenconded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

let nombre = 'William';
app.get('/usuario', (req, res) => {
    res.json(`getUsuario`);
});
app.post('/usuario', (req, res) => {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: "El nombre es necesario"
        });
    }
    res.json({ "persona": body });
});
app.put('/usuario', (req, res) => {
    res.json(`putUsuario`);
});
app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({ id });
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando en puerto: ', process.env.PORT);
});