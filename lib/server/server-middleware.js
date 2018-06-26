const axios = require('axios')
const qs = require('qs')

module.exports = options => {
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
      res.end(JSON.stringify(response.data))
    }).catch(e => {
      next(e)
    })
  }

  const whitelistedIPs = [
    '0.0.0.0',
    '127.0.0.1'
  ]

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
