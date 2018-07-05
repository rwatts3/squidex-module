import axios from 'axios'

export class Squidex {
  constructor () {
    this.apiClient = axios.create({ baseURL: `http://127.0.0.1:${process.env.PORT || 3000}` })
    this.accessToken = null
    this.tokenType = null
    this.cacheDuration = <%= options.tokenCacheDuration || 12 %> // seconds
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
    if (process.client) {
      return
    }

    if (this.token && this.lastRefreshAt && this.differenceInSeconds(new Date(), this.refreshedAt) < this.cacheDuration) {
      return this.token
    }

    return this.apiClient
      .post('api/squidex/refresh-token')
      .then(res => {
        this.accessToken = res.data.access_token
        this.tokenType = res.data.token_type
        this.refreshedAt = new Date()
        return this.token
      })
      .catch(function (error) {
        throw error
      })
  }
}
