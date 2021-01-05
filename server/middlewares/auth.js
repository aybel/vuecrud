import tokenService from '../services/token';

export default {
    verficarUsuario: async (req, res, next) => {
        
        if (!req.headers.token) {
            return res.status(404).send({
                message: "No existe token"
            });
        } else {
            const tokenDecodificado = await tokenService.decodificarToken(req.headers.token);
            if (tokenDecodificado.rol === 'admin'
                || tokenDecodificado.rol === 'almancen'
                || tokenDecodificado.rol === 'vendedor') {
                
                next();

            } else {
                return res.status(403).send({
                    message: "Usuario no tiene permisos"
                });
            }
        }
    },
    varficarAdmin: async (req, res, next) => {
        //Leer el token del headers
        //console.log(req.headers);
        if (!req.headers.token) {
            return res.status(404).send({
                message: "No existe token"
            });
        } else {
            const tokenDecodificado = await tokenService.decodificarToken(req.headers.token);
            if (tokenDecodificado.rol === 'admin') {
               
                next();

            } else {
                return res.status(403).send({
                    message: "Usuario no tiene permisos"
                });
            }
        }
    },
    varficarAlmacen: async (req, res, next) => {
       
        if (!req.headers.token) {
            return res.status(404).send({
                message: "No existe token"
            });
        } else {
            const tokenDecodificado = await tokenService.decodificarToken(req.headers.token);
            if (tokenDecodificado.rol === 'admin'
                || tokenDecodificado.rol === 'almancen'
            ) {
               
                next();

            } else {
                return res.status(403).send({
                    message: "Usuario no tiene permisos"
                });
            }
        }
    },
    varficarVendedor: async (req, res, next) => {
       
        if (!req.headers.token) {
            return res.status(404).send({
                message: "No existe token"
            });
        } else {
            const tokenDecodificado = await tokenService.decodificarToken(req.headers.token);
            if (tokenDecodificado.rol === 'admin'
                || tokenDecodificado.rol === 'vendedor') {
               
                next();

            } else {
                return res.status(403).send({
                    message: "Usuario no tiene permisos"
                });
            }
        }
    },
}