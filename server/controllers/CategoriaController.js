import models from '../models/index';

export default {
    agregar: async (req, res, next) => {
        //console.log("entro a agregar");
        try {
            console.log(req.body);
            const registro = await models.Categoria.create(req.body);
            res.status(200).json(registro);
        } catch (error) {
            res.status(500).send({
                message: "ocurrió un error"
            });
            next(error);
        }
    },
    consultar: async (req, res, next) => {
        try {
            const registro = await models.Categoria.findOne({ _id: req.query._id });
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
            let valor=req.query.valor;
            const registros = await models.Categoria.find({$or:[{'nombre':new RegExp(valor,'i')},{'descripcion':new RegExp(valor,'i')}]},{createdAt:0})
            .sort({'createdAt':-1});
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
            const respuesta = await models.Categoria.findByIdAndUpdate({ _id: req.body._id }, {
                nombre: req.body.nombre,
                descripcion: req.body.descripcion
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
            const respuesta = await models.Categoria.findOneAndDelete({
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
            const respuesta = await models.Categoria.findByIdAndUpdate({ _id: req.body._id }, {
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
            const respuesta = await models.Categoria.findByIdAndUpdate({ _id: req.body._id }, {
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

