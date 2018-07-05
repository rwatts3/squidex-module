const axios = require('axios')
const qs = require('qs')
const fs = require('fs-extra')

class TokenManager {
  constructor (syncFilePath = './squidex-token.json') {
    this.syncFilePath = syncFilePath
    if (fs.existsSync(syncFilePath)) {
      this._token = fs.readJsonSync(syncFilePath)
    } else {
      this._token = null
    }
  }

  get token () {
    return this._token
  }

  set token (token) {
    this._token = token
    fs.writeJsonSync(this.syncFilePath, token)
  }
}

const tokenManager = new TokenManager()

const whitelistedIPs = [
  '0.0.0.0',
  '127.0.0.1'
]

const refreshToken = options => {
  const instance = axios.create({
    baseURL: options.tokenEndpoint || 'https://cloud.squidex.io/identity-server/connect/token',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })

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

  return (req, res, next) => {
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
}

const initToken = () => {
  return (req, res, next) => {
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
}

module.exports = {
  refreshToken,
  initToken
}
