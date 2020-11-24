

const figlet = require('figlet')
const chalk = require('chalk')


module.exports = () => {
    console.log(chalk.yellow(figlet.textSync('Element 3', {
        font: 'big',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    })));
}
