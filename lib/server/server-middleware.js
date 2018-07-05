const axios = require('axios')
const qs = require('qs')
const TokenManager = require('./token-manager')

module.exports = (options) => {
  const whitelistedIPs = options.whitelistedIPs || [
    '0.0.0.0',
    '127.0.0.1'
  ]

  const instance = axios.create({
    baseURL: options.tokenEndpoint || 'https://cloud.squidex.io/identity-server/connect/token',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })

  const tokenManager = new TokenManager(options.cacheFilePath || './squidex-token.json')

  const refresh = (req, res, next) => {
    instance.post('', qs.stringify({
      'grant_type': options.grantType || 'client_credentials',
      'scope': options.scope || 'squidex-api',
      'client_id': options.clientId,
      'client_secret': options.clientSecret
    })).then(response => {
      tokenManager.token = response.data
      res.end(JSON.stringify(response.data))
    }).catch(e => {
      next(e)
    })
  }

  const refreshToken = (req, res, next) => {
    const pass =
      whitelistedIPs.indexOf(req.connection.remoteAddress) > -1 &&
      req.method === 'POST'

    if (pass) {
      refresh(req, res, next)
    } else {
      res.statusCode = 403
      res.send('Forbidden')
    }
  }

  const initToken = (req, res, next) => {
    const pass =
      whitelistedIPs.indexOf(req.connection.remoteAddress) > -1 &&
      req.method === 'POST'

    if (pass) {
      res.end(JSON.stringify(tokenManager.token || {}))
    } else {
      res.statusCode = 403
      res.send('Forbidden')
    }
  }

  return {
    refreshToken,
    initToken
  }
}


