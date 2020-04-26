# push-md

This command allows to convert a markdown file to a html document, and push it
through an API endpoint.

With the help of [unified][], [remark][] and [rehype][], mardown syntax is
extended, and some transformations are done.

## Usage

```shell
push-md --help
push-md <myfile.md>
push-md <myfile.md> --publish
push-md <myfile.md> --html
```

## Install

With [npm](https://npmjs.org/) installed, run

```shell
npm install -g push-md
```

## Workflows

### Global processing

1. Source markdown file is loaded as VFile
2. Mardown VFile is parsed by [remark-parse][] to mast
3. Frontmatter is extract and parsed as yaml
4. mast is converted to hast by [remark-rehype][]
5. hast is serialized to HTML by [rehype-stringify][]

### List of enabled plugins

- [remark-frontmatter][]
- [remark-extract-frontmatter][]
- [remark-footnotes][]
- [remark-abbr][]
- [remark-code-import][]
- [rehype-highlight][]
- [rehype-autolink-headings][]
- [rehype-accessible-emojis][]

## License

See [LICENCE](LICENCE)

[unified]: https://github.com/unifiedjs/unified
[remark]: https://github.com/remarkjs/remark
[rehype]: https://github.com/rehypejs/rehype

[remark-frontmatter]: https://www.npmjs.com/package/remark-frontmatter
[remark-extract-frontmatter]: https://www.npmjs.com/package/remark-extract-frontmatter
[remark-footnotes]: https://www.npmjs.com/package/remark-footnotes
[remark-abbr]: https://www.npmjs.com/package/remark-abbr
[remark-code-import]: https://www.npmjs.com/package/remark-code-import
[rehype-highlight]: https://www.npmjs.com/package/rehype-highlight
[rehype-autolink-headings]: https://www.npmjs.com/package/rehype-autolink-headings
[rehype-accessible-emojis]: https://www.npmjs.com/package/rehype-accessible-emojis
