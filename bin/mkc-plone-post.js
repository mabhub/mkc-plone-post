#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const request = require('request');
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

  prompt.get({
    properties,
  }, (err, result) => {
    if (err) throw err;
    request.post(`https://edit.makina-corpus.com${meta.attributes.url || result.postpath}/update-content`, {
      auth: {
        user: result.tri,
        pass: result.passwd,
        sendImmediately: false,
      },
      form: {
        text: fileContent,
      },
    }, (err2, httpResponse, body) => {
      if (err2) throw err;
      // eslint-disable-next-line no-console
      console.log(body);
    });
  });
}
