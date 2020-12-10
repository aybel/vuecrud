import models from '../models/index';
import bcrypt from 'bcrypt';
import Token from '../services/token';
export default {
    nuevo_usuario: async (req, res, next) => {
        try {
            //encriptamos el password 
            console.log(req.body);
            req.body.password = await bcrypt.hash(req.body.password, 10);

            const registro = await models.Usuario.create(req.body);
            res.status(200).json(registro);

        } catch (error) {
            res.status(500).send({
                msj: "Error"
            });
            next(error);
        }
    }, consultar: async (req, res, next) => {
        try {
            const registro = await models.Usuario.findOne({ _id: req.query._id });
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
            const registros = await models.Usuario.find({ $or: [{ 'nombre': new RegExp(valor, 'i') }, { 'email': new RegExp(valor, 'i') }] }, { createdAt: 0 })

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
            let pass = req.body.password;
            const user = await models.Usuario.findOne({ _id: _req.body._id });
            if (user.password != pass)
                req.body.password = await bcrypt.hash(req.body.password, 10);

            const respuesta = await models.Usuario.findByIdAndUpdate({ _id: req.body._id }, {
                rol: req.body.rol,
                nombre: req.body.nombre,
                tipo_documento: req.body.tipo_documento,
                num_documento: req.body.num_documento,
                direccion: req.body.direccion,
                telefono: req.body.telefono,
                email: req.body.email,
                password: req.body.password
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
            const respuesta = await models.Usuario.findOneAndDelete({
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
            const respuesta = await models.Usuario.findByIdAndUpdate({ _id: req.body._id }, {
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
            const respuesta = await models.Usuario.findByIdAndUpdate({ _id: req.body._id }, {
                estado: 0
            });
            res.status(200).json(respuesta);
        } catch (error) {
            res.status(500).send({
                message: "ocurrió un error"
            });
            next(error);
        }
    },
    login: async (req, res, next)=>{
        try {
            //Verificar el usario este registrado
            let user=await models.Usuario.findOne({email:req.body.email,estado:1});
            if(user){
                //Verificamos la contraseña sea la correcta
                let match=await bcrypt.compare(req.body.password,user.password);
                if(match){
                   //Generar un token asociado a ese usuario con jwt
                    let tokenGenerado=await Token.crearToken(user._id,user.rol,user.email);
                   res.status(200).json({user,tokenGenerado});

                }else{
                    res.status(404).send({
                        message:"Password incorrecto"
                    })
                }
            }else{
                res.status(404).send({
                    message:"Usuario no existe"
                })
            }
            
        } catch (error) {
            
        }
    }
}