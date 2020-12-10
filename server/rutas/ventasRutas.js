import routerx from 'express-promise-router';
import ventaController from '../controllers/VentaController';
import auth from '../middlewares/auth';

const router=routerx();

//agregamos las rutas de ventas
router.post('/agregar',auth.varficarVendedor,ventaController.agregar);
router.get('/consultar',auth.varficarVendedor,ventaController.consultar);
router.get('/listar',auth.varficarVendedor,ventaController.listar);
router.put('/activar',auth.varficarVendedor,ventaController.activar);
router.put('/desactivar',auth.varficarVendedor,ventaController.desactivar);
router.get('/graficar_meses',auth.verficarUsuario,ventaController.graficarMeses);
router.get('/consultar_fechas',auth.verficarUsuario,ventaController.consultaFechas);

export default router;