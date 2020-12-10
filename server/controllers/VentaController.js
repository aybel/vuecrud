import modelos from '../models/index';
async function aumentarStock(idArticulo, cantidad) {
    let { stock } = await modelos.Articulo.findOne({ _id: idArticulo });
    let nuevoStock = parseInt(cantidad) + parseInt(stock);
    const reg = await modelos.Articulo.findByIdAndUpdate({ _id: idArticulo }, { stock: nuevoStock });
    return reg;
}
async function reducirStock(idArticulo, cantidad) {
    let { stock } = await modelos.Articulo.findOne({ _id: idArticulo });
    let nuevoStock = parseInt(stock) - parseInt(cantidad);
    const reg = await modelos.Articulo.findByIdAndUpdate({ _id: idArticulo }, { stock: nuevoStock });
    return reg;
}

export default {
    agregar: async (req, res, next) => {
        //console.log("entro a agregar");
        try {
            //console.log(req.body);
            const registro = await modelos.Venta.create(req.body);
            let detalles = req.body.detalles;
            detalles.map(detalle => {
                console.log(detalle);
                reducirStock(detalle._id, detalle.cantidad);
            });
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
            const registro = await modelos.Venta.findOne({ _id: req.query._id })
                .populate('usuario', { nombre: 1 })
                .populate('persona', { nombre: 1 });
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
            const registros = await modelos.Venta.find(
                // {
                //     $or: [
                //         { 'num_comprobante': valor },
                //         { 'serie_comprobante': valor }
                //     ]
                // } 
                )
                .populate('usuario', { nombre: 1 })
                .populate('persona', { nombre: 1 })
                .sort({ 'createdAt': -1 });
            res.status(200).json(registros);
        } catch (error) {
            res.status(500).send({
                message: "ocurrió un error"
            });
            next(error);
        }
    },
    activar: async (req, res, next) => {
        try {
            const respuesta = await modelos.Venta.findByIdAndUpdate({ _id: req.body._id }, {
                estado: 1
            });
            let detalles = respuesta.detalles;
            detalles.map(detalle => {
                reducirStock(detalle._id, detalle.cantidad);
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
            const respuesta = await modelos.Venta.findByIdAndUpdate({ _id: req.body._id }, {
                estado: 0
            });
            let detalles = respuesta.detalles;
            detalles.map(detalle => {
                aumentarStock(detalle._id, detalle.cantidad)
            });
            res.status(200).json(respuesta);
        } catch (error) {
            res.status(500).send({
                message: "ocurrió un error"
            });
            next(error);
        }
    },
    graficarMeses:async(req,res,nex)=>{
        try {
            const registros=await modelos.Venta.aggregate(
                [
                    {
                        $group:{
                            _id:{
                                mes:{$month:"$createdAt"},
                                anio:{$year:"$createdAt"}
                            },
                            total:{$sum:"$total"},
                            numero:{$sum:1}
                        }

                    },
                    {
                        $sort:{
                            "_id.anio":-1,"_id.mes":-1
                        }
                    }
                ]
            ).limit(12);
            res.status(200).json(registros);
        } catch (error) {
            res.status(500).send({
                message: "ocurrió un error"
            });
            next(error);
        }

    },
    consultaFechas: async (req, res, next) => {
        try {
            let start = req.query.start;
            let end=req.body.end;

            const registros = await modelos.Venta.find(
                {"$createdAt":{"$gte":start, "$lt":end}}
            )
                .populate('usuario', { nombre: 1 })
                .populate('persona', { nombre: 1 })
                .sort({ 'createdAt': -1 });
            res.status(200).json(registros);
        } catch (error) {
            res.status(500).send({
                message: "ocurrió un error"
            });
            next(error);
        }

    }
}

