import routerx from 'express-promise-router';
import categoriaController from '../controllers/CategoriaController';
import auth from '../middlewares/auth';

const router=routerx();

//agregamos las rutas de categorias
router.post('/agregar',categoriaController.agregar);
router.get('/consultar',auth.varficarAlmacen,categoriaController.consultar);
router.get('/listar',categoriaController.listar);
router.put('/actualizar',categoriaController.actualizar);
router.put('/activar',categoriaController.activar);
router.put('/desactivar',categoriaController.desactivar);
router.delete('/borrar',auth.varficarAlmacen,categoriaController.borrar);

export default router;