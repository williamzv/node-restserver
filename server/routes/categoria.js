const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();

let Categoria = require('../models/categoria');


// =====================================
//  MOSTRAR TODAS LAS CATEGORIAS
// =====================================
app.get('/categoria', (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias: categoriasDB
            });
        });
});

// =====================================
//  MOSTRAR UNA CATEGORIA POR ID
// =====================================
app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'El id no es válido' }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// =====================================
//  CREAR NUEVA CATEGORIA
// =====================================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// =====================================
//  ACTUALIZAR UNA CATEGORIA
// =====================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    // Actualiza la descripcion
    let descCategoria = { descripcion: body.descripcion };
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, CategoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!CategoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: CategoriaDB
        });
    });
});

// =====================================
//  ELIMINAR UNA CATEGORIA
//  Solo un administrador puede eliminar
// =====================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'El id no existe' }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria eliminada'
        });

    });
});


module.exports = app;