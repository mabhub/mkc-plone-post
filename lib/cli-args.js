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
      type: 'boolean',
    },
    username: {
      alias: 'u',
      describe: 'Nom d\'utilisateur',
    },
    outputHtml: {
      alias: 'html',
      describe: 'Envoie le rendu HTML vers la sortie standard',
      default: false,
      type: 'boolean',
    },
    verbose: {
      alias: 'v',
      count: true,
    },
  });

const cleanup = ({
  v, // duplicate --verbose
  p, // duplicate --publish
  html, // duplicate --outputHtml
  'output-html': outputHtml, // duplicate --outputHtml
  _: [file], // only first argument renamed to 'file'
  ...rest
}) => ({
  file,
  ...rest,
});

module.exports = cleanup(argv);
