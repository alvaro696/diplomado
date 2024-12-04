import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import { Task } from "./tasks.js";
import { Status } from "../constants/index.js";
import logger from "../logs/logger.js";
import { encriptar } from "../common/bcrypt.js";

export const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: 'Username no puede ser nulo',
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Password no pueder ser null',
            }
        }
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: Status.ACTIVE,
        validate: {
            isIn: {
                args: [[Status.ACTIVE, Status.INACTIVE]],
                msg: 'El estado solo puede ser active o inactive'
            }
        }
    }
});

User.hasMany(Task)
Task.belongsTo(User)

/* User.hasMany(Task, {
    foreignKey: 'user_id',
    sourceKey: 'id',
})

Task.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'id',
}) */

User.beforeCreate(async (user) => {
    try {
        user.password = await encriptar(user.password);
    } catch (error) {
        logger.error(error.message);
        throw new Error('Error al en encriptar');
    }
})
User.beforeUpdate(async (user) => {
    try {
        user.password = await encriptar(user.password);
    } catch (error) {
        logger.error(error.message);
        throw new Error('Error al en al comparar');
    }
})