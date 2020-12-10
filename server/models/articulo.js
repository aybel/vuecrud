import mongoose, { Schema } from 'mongoose';

const articuloEsquema = new Schema({
    categoria:{
        type:Schema.ObjectId,
        ref:'categoria'
    },
    nombre: {
        type: String,
        maxlength: 200,
        unique: true,
        required: true
    },
    descripcion: {
        type: String,
        maxlength: 255
    },
    estado: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    codigo:{
        type: String,
        maxlength:64
    },
    precio_venta:{
        type:Number,
        required: true
    },
    stock:{
        type:Number,
        required: true
    }
});

const Articulo = mongoose.model('articulo', articuloEsquema);

export default Articulo;
