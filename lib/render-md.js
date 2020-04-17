const remark = require('remark');
const remarkHtml = require('remark-html');
const remarkFootnotes = require('remark-footnotes');
const remarkFrontmatter = require('remark-frontmatter');
const remarkExtractFrontmatter = require('remark-extract-frontmatter');
const remarkHighlight = require('remark-highlight.js');
const yaml = require('yaml').parse;

const render = async markdown => {
  const {
    contents: html,
    data: frontmatter,
  } = await remark()
    .use(remarkFrontmatter)
    .use(remarkExtractFrontmatter, { yaml })
    .use(remarkFootnotes)
    .use(remarkHighlight)
    .use(remarkHtml)
    .process(markdown);

  return {
    html,
    frontmatter,
  };
};

module.exports = {
  render,
};
