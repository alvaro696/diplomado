import { User } from "../models/users.js";
import { Task } from "../models/tasks.js";
import logger from "../logs/logger.js";
import { Status } from "../constants/index.js";

async function getUsers(reg, res) {
    try {
        const users = await User.findAll({
            attributes: [
                'id', 'username', 'password', 'status'
            ],
            order: [['id', 'DESC']],
            where: {
                status: Status.ACTIVE,
            }
        });
        logger.info('resultado' + users);
        res.json(users);
    } catch (error) {
        logger.error('error getuser ' + error);
        res.status(500).json({ message: 'server error' });
    }
}
async function createUser(reg, res) {
    try {
        const { username, password } = reg.body;
        const user = await User.create({ username, password });
        res.json(user);
    } catch (error) {
        logger.error('error createUser ' + error);
        res.status(500).json({ message: 'server error' });
    }
}

async function getUser(reg, res) {
    try {
        const user = await User.findByPk(reg.params.id, {
            attributes: [
                'username', 'status'
            ],
        });
        if (!user) {
            return res.status(404).json({ message: 'User no encontrado' });
        }
        res.json(user);
    } catch (error) {

        logger.error('error al obtenre usuario ' + error);
        res.status(500).json({ message: 'server error' });
    }
}

async function updateuser(req, res) {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
        if (!username || !password) return res.status(400).json({ message: 'Usuario o password requerido' });
        const user = await User.update(
            {
                username,
                password,
            },
            {
                where: {
                    id
                },
            }
        )
        res.json(user);
    } catch (error) {
        logger.error('error al actualizar usuario ' + error.message);
        res.status(500).json({ message: 'server error' });
    }
}

async function activateInactivate(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        if (!status) return res.status(400).json({ message: 'Status requerido' });
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encotnrado' });
        }
        if (user.status === status) {
            return res.status(400).json({ message: 'Es el mismo status' });
        }
        user.status = status;
        await user.save();
        res.json(user);
    } catch (error) {
        logger.error('error al actualizar usuario ' + error.message);
        res.status(500).json({ message: 'server error' });
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User no encotnrado' });
        }
        await user.destroy();
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        logger.error('error al eliminar usuario ' + error.message);
        res.status(500).json({ message: 'server error' });
    }
}

export default {
    getUsers,
    createUser,
    getUser,
    updateuser,
    activateInactivate,
    deleteUser
}