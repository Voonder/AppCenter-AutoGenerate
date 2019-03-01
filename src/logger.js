var chalk = require("chalk");

module.exports = {
    debug(message) {
        console.log(chalk.white(message));
    },
    log(message) {
        console.log(chalk.yellow(message));
    },
    info(message) {
        console.log(chalk.green(message));
    },
    warning(message) {
        console.log(chalk.keyword("orange")(message));
    },
    progress(message) {
        console.log(chalk.gray(message));
    },
    error(message) {
        console.log(chalk.bold.red(message));
    },
};
