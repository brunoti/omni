# @excelsia/prettier-config

A Prettier [shareable config](https://prettier.io/docs/en/configuration.html#sharing-configurations)
for projects using **[Prettier](https://prettier.io/)** separate processes.

## Installation

###### npm
```
npm install --save-dev @excelsia/prettier-config
```

###### yarn
```
yarn add --dev @excelsia/prettier-config
```

###### pnpm
```
pnpm add -D @excelsia/prettier-config
```

_This is only a shareable configuration. It does not install Prettier, Standard,
ESLint, or any other part of the tool chain._

## Usage

To use this config in your project, you will need to add the following to your
Prettier configuration. You should choose one based on your project's current config.

```jsonc
// `.prettierrc.json`
"@excelsia/prettier-config"
```

```javascript
// `prettier.config.js` or `.prettierrc.js`
module.exports = '@excelsia/prettier-config'
```

## Extending Shared Configurations

This configuration is not intended to be changed, but if you have a setup where
modification is required, it is possible. Prettier does not offer an "extends"
mechanism as you might be familiar from tools such as ESLint.

To extend a configuration you will need to:

1.  Import/Require this sharable config from within your own configuration. This
    means you must be using a JavaScript version of a Prettier configuration
    file.
2.  Extend your modification on top of the shared config using something like
    **[Object destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment )**,
    **[Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign )**,
    or **[lodash.merge()](https://lodash.com/docs/4.17.11#merge )**
3.  Export the modified configuration

> Prettier uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for
> configuration file support. This means you can configure prettier via:
>
> - A `.prettierrc` file, written in YAML or JSON, with optional extensions: `.yaml/.yml/.json`.
> - A `.prettierrc.toml` file, written in TOML (the `.toml` extension is _required_).
> - A `prettier.config.js` or `.prettierrc.js` file that exports an object.
> - A `"prettier"` key in your `package.json` file.
>
> ...
>
> **Sharing configurations**
>
> > Note: This method does **not** offer a way to _extend_ the configuration to
> > overwrite some properties from the shared configuration. If you need to do
> > that, import the file in a `.prettierrc.js` file and export the
> > modifications, e.g:
> >
> > ```js
> > module.exports = {
> >   ...require("@excelsia/prettier-config"),
> >   semi: false
> > };
> > ```
>
> _source: <https://github.com/prettier/prettier/blob/cacaa92a3f0acf9618f54cd60c9b36b37744dbde/docs/configuration.md>_

For example, if you need to change it so that semicolons are required:

```javascript
// `prettier.config.js` or `.prettierrc.js`
const prettierConfigStandard = require('@excelsia/prettier-config')
const merge = require('lodash.merge')

const modifiedConfig = merge(
  {},
  prettierConfigStandard,
  {
    semi: true,
    // ... other modified settings here
  }
)

module.exports = modifiedConfig
```
