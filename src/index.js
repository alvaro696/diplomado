import app from './app.js';
import 'dotenv/config';
import logger from './logs/logger.js';

async function main() {
    const port = process.env.PORT;
    app.listen(port);
    console.log('escuchando en el puerto: ' + port);
    logger.info('inicio');
}
main();