import routerx from 'express-promise-router';
import articuloController from '../controllers/ArticuloController';
import auth from '../middlewares/auth';

const router=routerx();

//agregamos las rutas de categorias
router.post('/agregar',auth.varficarVendedor,articuloController.agregar);
router.get('/consultar',auth.varficarVendedor,articuloController.consultar);
router.get('/listar',auth.varficarVendedor,articuloController.listar);
router.put('/actualizar',auth.varficarVendedor,articuloController.actualizar);
router.put('/activar',auth.varficarVendedor,articuloController.activar);
router.put('/desactivar',auth.varficarVendedor,articuloController.desactivar);
router.delete('/borrar',auth.varficarVendedor,articuloController.borrar);
router.get('/consulta_cod',auth.verficarUsuario,articuloController.consultar_cod);

export default router;