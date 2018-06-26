export function initStore (ctx) {
  const useVuex = ctx.store

  if (!useVuex) {
    throw Error('')
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
        initialize ({ commit, dispatch }) {
          if (this.$squidex == null) {
            return
          }
          commit('setToken', this.$squidex.token)
          return dispatch('refreshToken')
        },

        async refreshToken ({ commit, state }, isHardRefresh = false) {
          if (process.client || this.$squidex == null) {
            console.warn('should not refresh token client side')
            return
          }
          if (!isHardRefresh && state.token != null) {
            return state.token
          }
          try {
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
