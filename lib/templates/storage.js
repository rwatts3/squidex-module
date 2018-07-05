export function initStore (ctx) {
  const useVuex = ctx.store

  if (!useVuex) {
    throw Error('squidex-module: vuex is required for this plugin')
  }

  if (useVuex) {
    const storeModule = {
      namespaced: true,
      state: () => ({ token: null }),
      getters: {
        token: state => state.token
      },
      mutations: {
        setToken (state, token) {
          state.token = token
        }
      },
      actions: {
        async initialize ({ commit, dispatch }) {
          if (this.$squidex == null) {
            return
          }
          const token = await this.$squidex.initToken()
          commit('setToken', token)
        },

        async refreshToken ({ commit, state }, isHardRefresh = false) {
          if (process.client || this.$squidex == null) {
            console.warn('should not refresh token client side')
            return
          }
          if (!isHardRefresh && state.token != null) {
            console.log('return previous token')
            return state.token
          }
          try {
            console.log('refreshing token')
            const token = await this.$squidex.refreshToken()
            commit('setToken', token)
            return token
          } catch (e) {
            // TODO: Error log
            console.error('Failed to refresh squidex token: ', e)
          }
        }
      }
    }

    ctx.store.registerModule('squidex', storeModule, {
      preserveState: Boolean(ctx.store.state['squidex'])
    })
  }
}
