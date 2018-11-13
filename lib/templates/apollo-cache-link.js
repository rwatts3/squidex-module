import { ApolloLink, Observable } from 'apollo-link'
import LRU from 'lru-cache'

class ApolloCacheLinkError extends Error {
  constructor (message) {
    super(`[ApolloCacheLink] ${message}`)
  }
}

const cache = LRU({
  max: 1000,
  maxAge: 1000 * 3
})

class ApolloCacheLink extends ApolloLink {
  shouldCache

  normalize

  denormalize

  constructor ({
    shouldCache = true,
    normalize = data => JSON.stringify(data),
    denormalize = data => JSON.parse(data)
  } = {}) {
    super()

    this.shouldCache = shouldCache
    this.normalize = normalize
    this.denormalize = denormalize
  }

  /**
   * Determines if an operation is cacheable or not.
   */
  isCacheable = operation =>
    typeof this.shouldCache === 'function'
      ? this.shouldCache(operation)
      : this.shouldCache


  /**
   * Link query requester.
   */
  request = (operation, forward) => {
    if (this.isCacheable(operation)) {
      const key = operation.toKey()
      const cached = cache.has(key)

      if (cached) {
        return Observable.of(this.denormalize(cache.get(key), operation))
      }

      return forward(operation).map(result => {
        cache.set(
          key,
          this.normalize(result, operation)
        )

        return result
      })
    }

    return forward(operation)
  }
}

const createCacheLink = config => new ApolloCacheLink(config)

export { ApolloCacheLink, createCacheLink }
