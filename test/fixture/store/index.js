import Vuex from 'vuex'
const createStore = () => {
  const store = new Vuex.Store({
    actions: {
      async nuxtServerInit ({ commit, state }, { req }) {
        try {
          await store.dispatch('squidex/initialize')
        } catch (e) {
          console.error(e)
        }
      }
    },

    strict: process.env.NODE_ENV !== 'production'
  })
  return store
}

export default createStore
