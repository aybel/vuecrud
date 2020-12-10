import models from '../models/index';

export default {
    agregar: async (req, res, next) => {
        try {
            const registro = await models.Persona.create(req.body);
            res.status(200).json(registro);
        } catch (error) {
            res.status(500).send({
                msj: "Error"
            });
            next(error);
        }
    }, consultar: async (req, res, next) => {
        try {
            const registro = await models.Persona.findOne({ _id: req.query._id });
            if (!registro) {
                res.status(404).send({
                    msj: "El registro no existe"
                });
            } else {
                res.status(200).json(registro);
            }



        } catch (error) {
            res.status(500).send({
                msj: "El registro no existe"
            });
            next(error);
        }

    },
    listar: async (req, res, next) => {
        try {
            let valor = req.query.valor;
            const registros = await models.Persona.find({ $or: [{ 'nombre': new RegExp(valor, 'i') }, { 'email': new RegExp(valor, 'i') }] }, { createdAt: 0 })

                .sort({ 'createdAt': -1 });
            res.status(200).json(registros);
        } catch (error) {
            res.status(500).send({
                message: "ocurrió un error"
            });
            next(error);
        }
    },
    listar_clientes: async (req, res, next) => {
        try {
            let valor = req.query.valor;
            const registros = await models.Persona.find({ $or: [{ 'nombre': new RegExp(valor, 'i') }, { 'email': new RegExp(valor, 'i') }],'tipo_persona':'Cliente' }, { createdAt: 0 })
                .sort({ 'createdAt': -1 });
            res.status(200).json(registros);
        } catch (error) {
            res.status(500).send({
                message: "ocurrió un error"
            });
            next(error);
        }
    },
    listar_proveedores: async (req, res, next) => {
        try {
            let valor = req.query.valor;
            const registros = await models.Persona.find({ $or: [{ 'nombre': new RegExp(valor, 'i') }, { 'email': new RegExp(valor, 'i') }],'tipo_persona':'Proveedor' }, { createdAt: 0 })
                .sort({ 'createdAt': -1 });
            res.status(200).json(registros);
        } catch (error) {
            res.status(500).send({
                message: "ocurrió un error"
            });
            next(error);
        }
    },
    actualizar: async (req, res, next) => {
        try {
            const respuesta = await models.Persona.findByIdAndUpdate({ _id: req.body._id }, {
                tipo_persona: req.body.tipo_persona,
                nombre: req.body.nombre,
                tipo_documento: req.body.tipo_documento,
                num_documento: req.body.num_documento,
                direccion: req.body.direccion,
                telefono: req.body.telefono,
                email: req.body.email
            });
            res.status(200).json(respuesta);
        } catch (error) {
            res.status(500).send({
                message: "ocurrió un error"
            });
            next(error);
        }
    },
    borrar: async (req, res, next) => {
        try {
            const respuesta = await models.Persona.findOneAndDelete({
                _id: req.body._id
            });
            res.status(200).json(respuesta);
        } catch (error) {
            res.status(500).send({
                message: "ocurrió un error"
            });
            next(error);
        }
    },
    activar: async (req, res, next) => {
        try {
            const respuesta = await models.Persona.findByIdAndUpdate({ _id: req.body._id }, {
                estado: 1
            });
            res.status(200).json(respuesta);
        } catch (error) {
            res.status(500).send({
                message: "ocurrió un error"
            });
            next(error);
        }
    },
    desactivar: async (req, res, next) => {
        try {
            const respuesta = await models.Persona.findByIdAndUpdate({ _id: req.body._id }, {
                estado: 0
            });
            res.status(200).json(respuesta);
        } catch (error) {
            res.status(500).send({
                message: "ocurrió un error"
            });
            next(error);
        }
    }
}