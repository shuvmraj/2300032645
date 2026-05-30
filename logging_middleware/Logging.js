class LoggerMiddleware (stack, level, package) {
    constructor(stack, level, package) {
        this.stack = stack;
        this.level = level;
        this.package = package;
    }

    log() {
        console.log(`[${this.level}] [${this.package}] ${this.message}`);

    }
}