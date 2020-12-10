import jwt from 'jsonwebtoken';
import models from '../models';

async function revisarToken(token) {
    let __id = null;
    try {
        const { _id } = await jwt.decode(token);
        __id = _id;
    } catch (error) {
        return false;
    }

    const user = await models.Usuario.findOne({ _id: __id, estado: 1 });
    if (user) {
        const token = jwt.sign({ _id: _id }, 'FERGDSFSESDF', { expiresIn: '1d' });
        return { token, rol: user.rol }
    }else{
        return false;
    }

}

export default {
    crearToken: async (_id) => {
        const token = jwt.sign({ _id: _id }, 'FERGDSFSESDF', { expiresIn: '1d' }); //durará un día
        return token;
    },
    decodificarToken: async (token) => {
        try {
            const { _id } = await jwt.verify(token, 'FERGDSFSESDF');
            const user = await models.Usuario.findOne({ _id: _id, estado: 1 });
            if (user) {
                return user;
            } else {
                return false;
            }

        } catch (error) {
            const nuevoToken=await revisarToken(token);
            return nuevoToken;
        }
    }
}
