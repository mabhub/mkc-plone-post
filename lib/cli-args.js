const yargs = require('yargs');
const { name } = require('../package.json');

const { argv } = yargs
  .scriptName(name)
  .usage('$0 [--publish] [<fichier>]')
  .alias('help', 'h')
  .options({
    publish: {
      alias: 'p',
      describe: 'Publie l\'article',
      default: false,
      type: 'boolean',
    },
    username: {
      alias: 'u',
      describe: 'Nom d\'utilisateur',
    },
  });

module.exports = {
  publish: argv.publish,
  username: argv.username,
  file: argv._[0],
};
