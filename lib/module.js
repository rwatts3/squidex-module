const { resolve } = require('path')
const serverMiddleware = require('./server/server-middleware')

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

  this.requireModule(['@nuxtjs/apollo', {
    clientConfigs: {
      default: './core/apollo-client-config.js'
    }
  }])

  this.addServerMiddleware({
    path: '/api/squidex-token',
    handler: serverMiddleware(options)
  })

  this.addPlugin(resolve(__dirname, 'plugin.js'))
}
