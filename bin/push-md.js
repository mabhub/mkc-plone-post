#!/usr/bin/env node

require('dotenv').config();
require('../lib/update-notifier.js');

const FormData = require('form-data');
const path = require('path');
const fs = require('fs').promises;
const fetch = require('node-fetch');
const inquirer = require('inquirer');

const args = require('../lib/cli-args.js');
const { render } = require('../lib/render-md.js');

const isMdPath = pathname => path.extname(pathname).toLowerCase() === '.md';
const required = value => !!value || 'Ce champs ne peut être vide';

const shouldPromptUser = args.username === true
  || !process.env.PASS
  || !process.env.USER;

inquirer
  .registerPrompt('file-tree-selection', require('inquirer-file-tree-selection-prompt'));

(async () => {
  let filename = args.file;

  if (!filename) {
    const response = await inquirer.prompt({
      name: 'file',
      type: 'file-tree-selection',
      root: process.cwd(),
      onlyShowValid: true,
      validate: isMdPath,
    });
    filename = response.file;
  }

  try {
    await fs.access(filename);
  } catch (e) {
    console.error('Le fichier n\'existe pas ou est inaccessible.');
    process.exit(1);
  }

  if (!isMdPath(filename)) {
    console.error('Type de fichier invalide');
    process.exit(1);
  }

  const fileBuffer = await fs.readFile(filename);
  const markdown = fileBuffer.toString();

  if (!markdown) {
    console.error('Le fichier est vide.');
    process.exit(1);
  }

  const { frontmatter, html } = await render(markdown);

  if (args.outputHtml) {
    console.log(html);
    return;
  }

  if (args.publish === false) {
    return;
  }

  const answers = await inquirer.prompt([
    {
      name: 'username',
      message: 'Utilisateur',
      default: args.username && args.username !== true
        ? args.username
        : process.env.USER,
      when: shouldPromptUser,
      validate: required,
    },
    {
      name: 'pass',
      type: 'password',
      message: 'Mot de passe (non stocké)',
      when: !process.env.PASS,
      validate: required,
    },
    {
      name: 'url',
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
      when: typeof args.publish === 'undefined' && !args.outputHtml,
    },
  ]);

  const body = new FormData();
  body.append('text', html);

  const user = args.username && args.username !== true
    ? args.username
    : (answers.username || process.env.USER);
  const pass = answers.pass || process.env.PASS;

  const auth = Buffer.from(`${user}:${pass}`).toString('base64');
  const headers = {
    Authorization: `Basic ${auth}`,
  };

  const url = frontmatter.url || answers.url;

  if (args.publish || answers.publish) {
    const response = await fetch(`https://edit.makina-corpus.com${url}/update-content`, {
      method: 'POST',
      headers,
      body,
    });
    console.log(await response.text());
  }
})();
