const unified = require('unified');

const remarkParse = require('remark-parse');
const remarkFrontmatter = require('remark-frontmatter');
const remarkExtractFrontmatter = require('remark-extract-frontmatter');
const remarkFootnotes = require('remark-footnotes');
const remarkHighlight = require('remark-highlight.js');

const remark2rehype = require('remark-rehype');
const rehypeStringify = require('rehype-stringify');


const yaml = require('yaml').parse;

const render = async markdown => {
  const {
    contents: html,
    data: frontmatter,
  } = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkExtractFrontmatter, { yaml })
    .use(remarkFootnotes)
    .use(remarkHighlight)

    .use(remark2rehype)
    .use(rehypeStringify)

    .process(markdown);

  return {
    html,
    frontmatter,
  };
};

module.exports = {
  render,
};
