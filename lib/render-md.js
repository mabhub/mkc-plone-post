const toVFile = require('to-vfile');
const report = require('vfile-reporter');

const unified = require('unified');

const remarkParse = require('remark-parse');
const remarkFrontmatter = require('remark-frontmatter');
const remarkExtractFrontmatter = require('remark-extract-frontmatter');
const remarkFootnotes = require('remark-footnotes');

const remark2rehype = require('remark-rehype');
const rehypeHighlight = require('rehype-highlight');
const rehypeSlug = require('rehype-slug');
const rehypeAutolinkHeadings = require('rehype-autolink-headings');
const { rehypeAccessibleEmojis } = require('rehype-accessible-emojis');
const rehypeRaw = require('rehype-raw');
const rehypeFormat = require('rehype-format');
const rehypeStringify = require('rehype-stringify');

const yaml = require('yaml').parse;

const render = async filename => {
  const processingStack = unified()
    // raw string to Markdown AST
    .use(remarkParse)

    .use(remarkFrontmatter)
    .use(remarkExtractFrontmatter, { yaml })
    .use(remarkFootnotes)

    // Markdown AST to HTML AST
    .use(remark2rehype, { allowDangerousHTML: true })

    .use(rehypeHighlight)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeAccessibleEmojis)
    .use(rehypeRaw)
    .use(rehypeFormat)

    // HTML AST to HTML
    .use(rehypeStringify);

  const VFile = await processingStack.process(toVFile.readSync(filename));

  return {
    html: VFile.contents,
    frontmatter: VFile.data,
    report: report([VFile]),
    vfile: VFile,
  };
};

module.exports = {
  render,
};
