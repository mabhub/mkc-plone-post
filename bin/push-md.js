#!/usr/bin/env node

require('dotenv').config();
require('../lib/update-notifier.js');

const FormData = require('form-data');
const path = require('path');
const fs = require('fs').promises;
const fetch = require('node-fetch');
const inquirer = require('inquirer');

const { publish, username, file } = require('../lib/cli-args.js');
const { render } = require('../lib/render-md.js');

const isMdPath = pathname => path.extname(pathname).toLowerCase() === '.md';

inquirer
  .registerPrompt('file-tree-selection', require('inquirer-file-tree-selection-prompt'));

(async () => {
  let fileName = file;

  if (!fileName) {
    const response = await inquirer.prompt({
      name: 'file',
      type: 'file-tree-selection',
      root: process.cwd(),
      onlyShowValid: true,
      validate: isMdPath,
    });
    fileName = response.file;
  }

  try {
    await fs.access(fileName);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Le fichier n\'existe pas ou est inaccessible.');
    process.exit(1);
  }

  if (!isMdPath(fileName)) {
    // eslint-disable-next-line no-console
    console.error('Type de fichier invalide');
    process.exit(1);
  }

  const sourceFile = await fs.readFile(fileName);
  const sourceText = sourceFile.toString();

  if (!sourceText) {
    // eslint-disable-next-line no-console
    console.error('Le fichier est vide.');
    process.exit(1);
  }

  const {
    frontmatter,
    html: htmlSource,
  } = await render(sourceText);

  const required = value => !!value || 'Ce champs ne peut être vide';

  const result = await inquirer.prompt([
    {
      name: 'tri',
      message: 'Utilisateur',
      default: username && username !== true ? username : process.env.USER,
      when: username === true || !process.env.PASS || !process.env.USER,
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
    {
      name: 'publish',
      type: 'confirm',
      message: 'Voulez-vous publier ce contenu ?',
      default: false,
      when: !publish,
    },
  ]);

  const body = new FormData();
  body.append('text', htmlSource);

  const user = username && username !== true
    ? username
    : (result.tri || process.env.USER);
  const pass = result.passwd || process.env.PASS;

  const auth = Buffer.from(`${user}:${pass}`).toString('base64');
  const headers = {
    Authorization: `Basic ${auth}`,
  };

  const postPath = frontmatter.url || result.postpath;

  if (publish || result.publish) {
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
