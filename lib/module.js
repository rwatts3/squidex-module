const { resolve } = require('path')
const serverMiddleware = require('./server/server-middleware')

module.exports = async function module (moduleOptions) {
  const options = Object.assign({}, this.options.squidex, moduleOptions)

  const { initToken, refreshToken } = serverMiddleware(options)

  this.addTemplate({
    src: resolve(__dirname, 'templates/apollo-client-config.js'),
    fileName: './core/apollo-client-config.js',
    options
  })

  this.addTemplate({
    src: resolve(__dirname, 'templates/squidex.js'),
    fileName: './core/squidex.js',
    options
  })

  this.addTemplate({
    src: resolve(__dirname, 'templates/storage.js'),
    fileName: './core/storage.js',
    options
  })

  this.addVendor([
    'graphql',
    'graphql-tag'
  ])

  this.addServerMiddleware({
    path: '/api/squidex/init-token',
    handler: initToken
  })

  this.addServerMiddleware({
    path: '/api/squidex/refresh-token',
    handler: refreshToken
  })

  this.addPlugin(resolve(__dirname, 'plugin.js'))

  this.requireModule(['@nuxtjs/apollo', {
    clientConfigs: {
      default: './core/apollo-client-config.js'
    }
  }])
}

module.exports.meta = require('../package.json')
