#!/usr/bin/env node

require('dotenv').config();
const FormData = require('form-data');
const path = require('path');
const fs = require('fs').promises;
const fetch = require('node-fetch');
const yargs = require('yargs');
const inquirer = require('inquirer');
const updateNotifier = require('update-notifier');

const pkg = require('../package.json');
const { render } = require('../lib/render-md.js');

const notifier = updateNotifier({ pkg });
notifier.notify();

inquirer
  .registerPrompt('file-tree-selection', require('inquirer-file-tree-selection-prompt'));

yargs
  .scriptName(pkg.name)
  .usage('$0 [--publish] [<fichier>]')
  .alias('help', 'h')
  .options({
    publish: {
      alias: 'p',
      describe: 'Publie l\'article',
      default: false,
      type: 'boolean',
    },
  });

const ALLOWED_TYPES = ['.html', '.md'];

const {
  argv: {
    publish,
    _,
  },
} = yargs;

(async () => {
  let [fileName] = _;

  if (!fileName) {
    const response = await inquirer.prompt({
      name: 'file',
      type: 'file-tree-selection',
      root: process.cwd(),
      onlyShowValid: true,
      validate: value => ALLOWED_TYPES.includes(path.extname(value).toLowerCase()),
    });
    fileName = response.file;
  }

  try {
    await fs.access(fileName);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  }

  const sourceFile = await fs.readFile(fileName);
  const sourceType = path.extname(fileName);

  if (!ALLOWED_TYPES.includes(sourceType.toLowerCase())) {
    // eslint-disable-next-line no-console
    console.error('Type de fichier invalide');
    process.exit(1);
  }

  const sourceText = sourceFile.toString();
  if (!sourceText) {
    process.exit(1);
  }

  let frontmatter;
  let htmlSource;

  switch (sourceType) {
    case '.html':
      htmlSource = sourceText;
      frontmatter = {};
      break;
    case '.md':
    default: {
      const rendered = await render(sourceText);
      frontmatter = rendered.frontmatter;
      htmlSource = rendered.html;
    }
  }

  const required = value => !!value || 'Ce champs ne peut être vide';

  const result = await inquirer.prompt([
    {
      name: 'tri',
      message: 'Utilisateur',
      default: process.env.USER,
      when: !process.env.PASS || !process.env.USER,
      validate: required,
    },
    {
      name: 'passwd',
      type: 'password',
      message: 'Mot de passe (non stocké)',
      when: !process.env.PASS,
      validate: required,
    },
    {
      name: 'postpath',
      message: 'Chemin complet du end-point de l\'article',
      default: frontmatter.url,
      when: !frontmatter.url,
      validate: required,
    },
  ]);

  const { confirmPublish } = await inquirer.prompt({
    name: 'publish',
    type: 'confirm',
    message: 'Voulez-vous publier ce contenu ?',
    default: false,
    when: !publish,
  });

  const body = new FormData();
  body.append('text', htmlSource);

  const user = result.tri || process.env.USER;
  const pass = result.passwd || process.env.PASS;

  const auth = Buffer.from(`${user}:${pass}`).toString('base64');
  const headers = {
    Authorization: `Basic ${auth}`,
  };

  const postPath = frontmatter.url || result.postpath;

  if (publish || confirmPublish) {
    const response = await fetch(`https://edit.makina-corpus.com${postPath}/update-content`, {
      method: 'POST',
      headers,
      body,
    });
    // eslint-disable-next-line no-console
    console.log(await response.text());
  }

  // eslint-disable-next-line no-console
  console.log('Terminé.');
})();
