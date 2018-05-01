const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// =====================================
//  OBTENER TODOS LOS PRODUCTOS
//  Populate: usuario y categoria
//  Paginado
// =====================================
app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos: productosDB
            });
        });
});


// =====================================
//  OBTENER UN PRODUCTO POR ID
//  Populate: usuario y categoría
// =====================================
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: { message: 'El id del producto no es válido' }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

// =====================================
//  BUSCAR PRODUCTOS
// =====================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex, disponible: true })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});



// =====================================
//  CREAR UN NUEVO PRODUCTO
//  Grabar el usuario
//  Grabar la categoria del producto
// =====================================
app.post('/productos/', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});

// =====================================
//  ACTUALIZAR UN PRODUCTO
//  Grabar el usuario
//  Grabar la categoria del producto
// =====================================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'El id del producto no es válido' }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoSave) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoSave) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoSave
            });
        });
    });
});

// ========================================
//  ELIMINAR UN PRODUCTO
//  Cambiar el estado de Disponible a False
// ========================================
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let disponible = { disponible: false };
    Producto.findByIdAndUpdate(id, disponible, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'El Id no es válido' }
            });
        }
        res.json({
            ok: true,
            producto: productoDB,
            message: 'Producto Eliminado'
        });
    });
});


module.exports = app;