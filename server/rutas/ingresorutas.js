import routerx from 'express-promise-router';
import ingresoController from '../controllers/IngresoController';
import auth from '../middlewares/auth';

const router=routerx();

//agregamos las rutas de ingresos
router.post('/agregar',auth.varficarAlmacen,ingresoController.agregar);
router.get('/consultar',auth.varficarAlmacen,ingresoController.consultar);
router.get('/listar',auth.varficarAlmacen,ingresoController.listar);
router.put('/activar',auth.varficarAlmacen,ingresoController.activar);
router.put('/desactivar',auth.varficarAlmacen,ingresoController.desactivar);
router.get('/graficar_meses',auth.verficarUsuario,ingresoController.graficarMeses);
router.get('/consultar_fechas',auth.verficarUsuario,ingresoController.consultaFechas);

export default router;