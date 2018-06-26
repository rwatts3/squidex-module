import { createHttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { RetryLink } from 'apollo-link-retry'
import Observable from 'zen-observable'

export default ({ store, app, env }) => {
  const httpLink = createHttpLink({
    uri: '<%= options.endpoint %>'
  })

  const authLink = setContext(async (_, { headers }) => {
    let token = store.getters['squidex/token']
    return {
      headers: {
        ...headers,
        authorization: token
      }
    }
  })

  const errorLink = onError(({ response, networkError, graphQLErrors, operation, forward }) => {
    if (networkError && networkError.statusCode === 401) {
      console.error('token invalid at', new Date())

      if (process.server) {
        return new Observable(async observer => {
          const refreshedToken = await store.dispatch('squidex/refreshToken')
          observer.next({ token: refreshedToken })
          observer.complete()
        }).flatMap(({ token }) => {
          const oldHeaders = operation.getContext().headers
          operation.setContext({
            headers: {
              ...oldHeaders,
              authorization: token
            }
          })
          return forward(operation)
        })
      } else {
        console.warn('squidex: token expired, reload page')
        window.location.reload()
      }
    }

    console.error(networkError)
  })

  const retryLink = new RetryLink({
    delay: {
      initial: 300
    },
    attempts: {
      max: 1
    }
  })

  return {
    link: retryLink.concat(authLink).concat(errorLink).concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: true
  }
}
