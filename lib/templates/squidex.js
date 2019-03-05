import axios from 'axios'

export class Squidex {
  constructor () {
    this.apiClient = axios.create({ baseURL: `http://<%= options.apiHost || '0.0.0.0' %>:${process.env.PORT || 3000}` })
    this.accessToken = null
    this.tokenType = null
    this.cacheDuration = <%= options.tokenCacheDuration || 7 * 24 * 60 * 60 %> // defaults to a week
  }

  get token () {
    if (this.accessToken) {
      return this.tokenType + ' ' + this.accessToken
    }
    return null
  }

  get hasToken () {
    return !!this.accessToken
  }

  differenceInSeconds(lhs, rhs) {
    return (lhs.getTime() - rhs.getTime()) / 1000
  }

  initToken () {
    if (process.client) {
      return
    }

    if (this.token) {
      return this.token
    }

    return this.apiClient
      .post('api/squidex/init-token')
      .then(res => {
        this.accessToken = res.data.access_token
        this.tokenType = res.data.token_type
        return this.token
      })
      .catch(function (error) {
        throw error
      })
  }

  refreshToken () {
    console.log('squidex: attempt to request new token')

    if (process.client) {
      return
    }

    if (this.token && this.refreshedAt && this.differenceInSeconds(new Date(), this.refreshedAt) < this.cacheDuration) {
      console.log(`squidex: return cached token. Last refresh at: ${this.refreshedAt}. now: ${new Date()}. cacheDuration: ${this.cacheDuration} `)
      return this.token
    }

    console.log('squidex: do request new token')

    return this.apiClient
      .post('api/squidex/refresh-token')
      .then(res => {
        this.accessToken = res.data.access_token
        this.tokenType = res.data.token_type
        this.refreshedAt = new Date()
        console.log(`squidex: token saved on ${this.refreshedAt}`)
        return this.token
      })
      .catch(function (error) {
        console.log('squidex: failed to retrieved token from squidex server')
        throw error
      })
  }
}
