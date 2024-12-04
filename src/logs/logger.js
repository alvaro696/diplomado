import pino from 'pino';

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            translateTime: 'SYS:yyyy-mm-dd HH:mm:ss',
        },
    }
});

export default logger;