const { resolve } = require('path')
require('dotenv').config()

module.exports = {
  rootDir: resolve(__dirname, '../..'),
  srcDir: __dirname,
  dev: false,
  render: {
    resourceHints: false
  },
  modules: ['@@'],
  squidex: {
    endpoint: 'https://cloud.squidex.io/api/content/freebees/graphql',
    clientId: process.env.SQUIDEX_CLIENT_ID,
    clientSecret: process.env.SQUIDEX_CLIENT_SECRET,
    tokenCacheDuration: 15,
    cacheFilePath: 'test-token.json'
  },
  build: {
    vendor: [
      'graphql',
      'graphql-tag'
    ]
  }
}
