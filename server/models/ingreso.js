import mongoose, { Schema } from 'mongoose';

const ingresoSchema = new Schema({
    usuario: {
        type: Schema.ObjectId,
        ref: 'usuario',
        required: true
    },
    persona: {
        type: Schema.ObjectId,
        ref: 'persona',
        required: true
    },
    tipo_comprobante: {
        type: String,
        maxlength: 20,
        required: true
    },
    serie_comprobante: {
        type: String,
        maxlength: 7

    },
    num_comprobante: {
        type: Number,
        required: true
    },
    impuesto: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: Number,
        default: 1
    },
    detalles:
        [{
            _id: {
                type: String,
                required: true
            },
            articulo: {
                type: String,
                required: true
            },
            cantidad: {
                type: Number,
                required: true
            },
            precio: {
                type: Number,
                required: true
            }
        }],
});

const Ingreso = mongoose.model('ingreso', ingresoSchema);

export default Ingreso;