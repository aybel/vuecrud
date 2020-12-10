//config del servidor com emascript 5
//const express=require('express');

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import rutas from './rutas';
import bodyParser from 'body-parser';
//Conexión a la base de datos///////////////////////////////////////
const DB_URL = 'mongodb://localhost:27017/db_sistema';
mongoose.Promise=global.Promise;
mongoose.connect(DB_URL, {useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true })
.then(
    mongoose=>console.log("Conectando a la base de datos de MongoDB en el puerto 27017"))
.catch(
    err=>console.log(err)
);
//termina la conexión a la base de datos de mongo//////////////////

//inicio del servidor//////////////////////////////////////////////
const app = express();
//habilidar para recibir peticiones json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Parsear el body usando body parser
app.use(bodyParser.json()); // body en formato json
app.use(bodyParser.urlencoded({ extended: false })); //body formulario


app.set('port', process.env.PORT || 3000);
const PORT = app.get('port');
const ruta_public = path.join(__dirname, 'public');
app.use(express.static(ruta_public));
app.use(morgan('dev'));
app.use(cors());



//estas  lineas siempre van antes de definir las rutas
app.use('/api',rutas);

//termina configuración del servidor//////////////////////////


app.listen(PORT, () => {
    console.log(`Servidor puerto ${PORT} ...`);

});


