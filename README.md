# squidex-module
[![npm (scoped with tag)](https://img.shields.io/npm/v/squidex-module/latest.svg?style=flat-square)](https://npmjs.com/package/squidex-module)
[![npm](https://img.shields.io/npm/dt/squidex-module.svg?style=flat-square)](https://npmjs.com/package/squidex-module)
[![CircleCI](https://img.shields.io/circleci/project/github/rb2-bv/squidex.svg?style=flat-square)](https://circleci.com/gh/rb2-bv/squidex)
[![Codecov](https://img.shields.io/codecov/c/github/rb2-bv/squidex.svg?style=flat-square)](https://codecov.io/gh/rb2-bv/squidex)
[![Dependencies](https://david-dm.org/rb2-bv/squidex/status.svg?style=flat-square)](https://david-dm.org/rb2-bv/squidex)
[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)

> 

[📖 **Release Notes**](./CHANGELOG.md)

## Features

The module features

## Setup
- Add `squidex-module` dependency using yarn or npm to your project
- Add `squidex-module` to `modules` section of `nuxt.config.js`

```js
{
  modules: [
    // Simple usage
    'squidex-module',

    // With options
    ['squidex-module', { /* module options */ }],
 ]
}
```

## Usage

Module Description

## Development

- Clone this repository
- Install dependencies using `yarn install` or `npm install`
- Start development server using `npm run dev`
- Add .env under the root directory:
 ```
  // example: .env
    SQUIDEX_TOKEN_URL=https://cloud.squidex.io/identity-server/connect/token
    SQUIDEX_TOKEN_GRANT_TYPE=client_credentials
    SQUIDEX_TOKEN_SCOPE=squidex-api
    SQUIDEX_CLIENT_ID=<your:clientid>
    SQUIDEX_CLIENT_SECRET=<secret>
 ```

## License

[MIT License](./LICENSE)

Copyright (c) zipme <gk@rb2.nl>
