class LoggerMiddleware {
    constructor(level = 'INFO') {
        this.level = level;
    }

    log(message) {
        console.log(`[${this.level}] ${message}`);
    }
}

module.exports = LoggerMiddleware;