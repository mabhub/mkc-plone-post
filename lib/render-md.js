const unified = require('unified');

const remarkParse = require('remark-parse');
const remarkFrontmatter = require('remark-frontmatter');
const remarkExtractFrontmatter = require('remark-extract-frontmatter');
const remarkFootnotes = require('remark-footnotes');
const remarkHighlight = require('remark-highlight.js');

const remark2rehype = require('remark-rehype');
const rehypeSlug = require('rehype-slug');
const rehypeAutolinkHeadings = require('rehype-autolink-headings');
const { rehypeAccessibleEmojis } = require('rehype-accessible-emojis');
const rehypeRaw = require('rehype-raw');
const rehypeFormat = require('rehype-format');

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

    .use(remark2rehype, { allowDangerousHTML: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeAccessibleEmojis)
    .use(rehypeRaw)
    .use(rehypeFormat)
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
