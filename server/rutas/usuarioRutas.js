import routerx from 'express-promise-router';
import usuarioController from '../controllers/UsuarioController';
import auth from '../middlewares/auth';

const router=routerx();

//agregamos las rutas de categorias
router.post('/nuevo_usuario',usuarioController.nuevo_usuario);
router.get('/consultar',auth.varficarAdmin,usuarioController.consultar);
router.get('/listar',auth.varficarAdmin,usuarioController.listar);
router.put('/actualizar',auth.varficarAdmin,usuarioController.actualizar);
router.put('/activar',auth.varficarAdmin,usuarioController.activar);
router.put('/desactivar',auth.varficarAdmin,usuarioController.desactivar);
router.delete('/borrar',auth.varficarAdmin,usuarioController.borrar);
router.post('/login',usuarioController.login);

export default router;