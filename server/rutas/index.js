import routerx from 'express-promise-router';
import categoriaRutas from './categoriaRutas';
import articuloRutas from './articuloRutas';
import usuarioRutas from './usuarioRutas';
import personaRutas from './personaRutas';
import ingresoRutas from './ingresorutas';
import ventaRutas from './ventasRutas';
const router = routerx();

//cuando detecta /categoria le decimos que las rutas
//se van a gestionar con el archivoCategoria rutas
//y depende de los verbos http es a la función del controlador
//que va a usar
router.use('/categoria', categoriaRutas);
router.use('/articulo', articuloRutas);
router.use('/usuario', usuarioRutas);
router.use('/persona', personaRutas);
router.use('/ingreso', ingresoRutas);
router.use('/ventas', ventaRutas);
export default router;