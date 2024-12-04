import app from './app.js';
import sequelize from './database/database.js';
import 'dotenv/config';
import logger from './logs/logger.js';

async function main() {
    await sequelize.sync();
    const port = process.env.PORT;
    app.listen(port);
    console.log('escuchando en el puerto: ' + port);
    logger.info('inicio');
}
main();