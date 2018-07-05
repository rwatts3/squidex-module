const { resolve } = require('path')
const { initToken, refreshToken } = require('./server/server-middleware')

module.exports = async function module (moduleOptions) {
  const options = Object.assign({}, this.options.squidex, moduleOptions)

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
    handler: initToken(options)
  })

  this.addServerMiddleware({
    path: '/api/squidex/refresh-token',
    handler: refreshToken(options)
  })

  this.addPlugin(resolve(__dirname, 'plugin.js'))

  this.requireModule(['@nuxtjs/apollo', {
    clientConfigs: {
      default: './core/apollo-client-config.js'
    }
  }])
}


module.exports.meta = require('../package.json')
