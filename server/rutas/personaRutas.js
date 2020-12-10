import routerx from 'express-promise-router';
import personaController from '../controllers/PersonaController';
import auth from '../middlewares/auth';

const router = routerx();

//agregamos las rutas de categorias
router.post('/agregar', auth.verficarUsuario, personaController.agregar);
router.get('/consultar', auth.verficarUsuario, personaController.consultar);
router.get('/listar', auth.verficarUsuario, personaController.listar);
router.get('/listar_clientes', auth.verficarUsuario, personaController.listar_clientes);
router.get('/listar_proveedores', auth.verficarUsuario, personaController.listar_proveedores);
router.put('/actualizar', auth.verficarUsuario, personaController.actualizar);
router.put('/activar', auth.verficarUsuario, personaController.activar);
router.put('/desactivar', auth.verficarUsuario, personaController.desactivar);
router.delete('/borrar', auth.verficarUsuario, personaController.borrar);


export default router;