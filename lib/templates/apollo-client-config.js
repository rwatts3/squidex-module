import { createHttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { RetryLink } from 'apollo-link-retry'
import Observable from 'zen-observable'
import { ApolloLink } from 'apollo-link'

export default ({ store, app, env }) => {
  const cache = new InMemoryCache()

  const httpLink = createHttpLink({
    uri: '<%= options.endpoint %>'
  })

  const authLink = setContext(async (_, { headers }) => {
    let token = process.server
      ? app.$squidex.token
      : store.getters['squidex/token']

    return {
      headers: {
        ...headers,
        authorization: token,
        <% if (options.showDraft) { %>
        'X-Unpublished': 'true'
        <% } %>
      }
    }
  })

  const loggerLink = new ApolloLink((operation, forward) =>
    forward(operation).map(result => {
      if (process.client) return result

      const { operationName } = operation
      console.log('operationName: ', operationName || 'null')
      return result
    })
  )

  const errorLink = onError(({ response, networkError, graphQLErrors, operation, forward }) => {
    if (networkError && networkError.statusCode === 401) {
      console.error('squidex: token invalid at', new Date())

      if (process.server) {
        return new Observable(async observer => {
          console.log('dispathcing to refresh.')
          const refreshedToken = await store.dispatch('squidex/refreshToken', true)
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
    link: retryLink.concat(authLink).concat(loggerLink).concat(errorLink).concat(httpLink),
    cache,
    connectToDevTools: true
  }
}
