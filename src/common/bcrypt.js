import bcrypt from 'bcrypt';
import logger from '../logs/logger.js';
export const encriptar = async (txt) => {
    try {
        const saltos = +process.env.BCRYPT_SALT_ROUNDS
        return await bcrypt.hash(txt, saltos)
    } catch (error) {
        logger.error(error.message);
        throw new Error('Error al encriptar');
    }
}
export const comparar = async (txt, hash) => {
    try {
        return await bcrypt.compare(txt, hash);
    } catch (error) {
        logger.error(error.message);
        throw new Error('Error al comparar');

    }
}