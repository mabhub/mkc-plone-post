#!/usr/bin/env node

const FormData = require('form-data');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const prompt = require('prompt');
const render = require('gfm-hljs-fm');

if (process.argv[2] && fs.existsSync(process.argv[2])) {
  let fileContent;
  let meta;

  const sourcetype = path.extname(process.argv[2]);
  const sourcefile = fs.readFileSync(process.argv[2]).toString();

  switch (sourcetype) {
    case '.html':
      fileContent = sourcefile;
      meta = { attributes: {} };
      break;
    case '.md':
    default:
      fileContent = render(sourcefile);
      meta = render(sourcefile, { style: 'js' });
      break;
  }

  prompt.start();

  const properties = {
    tri: {
      description: 'Utilisateur',
      message: 'Ce champs est requis',
      required: true,
    },
    passwd: {
      description: 'Mot de passe (non stocké)',
      message: 'Ce champs est requis',
      replace: '*',
      required: true,
      hidden: true,
    },
  };

  if (!meta.attributes.url) {
    properties.postpath = {
      description: 'Chemin complet du end-point de l\'article',
      message: 'Ce champs est requis',
      required: true,
    };
  }

  prompt.get({ properties }, async (err, result) => {
    if (err) throw err;

    const body = new FormData();
    body.append('text', fileContent);

    const auth = Buffer.from(`${result.tri}:${result.passwd}`).toString('base64');
    const headers = {
      Authorization: `Basic ${auth}`,
    };

    const postPath = meta.attributes.url || result.postpath;
    const response = await fetch(`https://edit.makina-corpus.com${postPath}/update-content`, {
      method: 'POST',
      headers,
      body,
    });

    // eslint-disable-next-line no-console
    console.log(await response.json());
  });
}
