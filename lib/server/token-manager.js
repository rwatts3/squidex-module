const fs = require('fs-extra')

module.exports = class TokenManager {
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
