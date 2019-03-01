var chalk = require("chalk");

module.exports = {
    debug(message) {
        console.log(chalk.white(message));
    },
    info(message) {
        console.log(chalk.green(message));
    },
    warning(message) {
        console.log(chalk.orange(message));
    },
    error(message) {
        console.log(chalk.bold.red(message));
    },
};
