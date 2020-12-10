import routerx from 'express-promise-router';
import personaController from '../controllers/PersonaController';
import auth from '../middlewares/auth';

const router = routerx();

//agregamos las rutas de categorias
router.post('/agregar', personaController.agregar);
router.get('/consultar', personaController.consultar);
router.get('/listar', personaController.listar);
router.get('/listar_clientes', personaController.listar_clientes);
router.get('/listar_proveedores', personaController.listar_proveedores);
router.put('/actualizar', personaController.actualizar);
router.put('/activar', personaController.activar);
router.put('/desactivar', personaController.desactivar);
router.delete('/borrar', personaController.borrar);


export default router;