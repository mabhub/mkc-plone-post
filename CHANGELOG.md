
2.0.0 / 2020-04-20
==================

  * Adjust linting rules
  * Change variable names
  * Revert "Separate publish confirmation from previous questions"
  * Extract update-notifier management to a separate module
  * Drop HTML input management
  * Extract CLI args management to a separate module
  * Use CLI username value as default value when prompting username

1.1.0 / 2020-04-19
==================

  * Allow to define user from CLI option
  * Add update notification feature
  * Separate publish confirmation code from previous questions
  * Prompt for publishing when no `--publish` given

1.0.0 / 2020-04-19
==================

  * Rename package to push-md
  * Add basic command help
  * Allow to choose file interactively
  * Use inquirer instead of prompt
  * Use yargs package to manage CLI arguments
  * Add metadata to package.json

0.2.0 / 2020-04-18
==================

  * Add file & script to manage CHANGELOG
  * Restore highlight.js syntax parsing
  * Use RemarkJS instead of ugly gfm-hljs-fm
  * Allow getting credentials from ENV
  * Use node-fetch instead of request
  * Add, configure and enforce eslint
  * Fix fileContent var name
  * Allow posting html files directly
  * Use `let` instead of `var`
  * First quick & dirty working version
