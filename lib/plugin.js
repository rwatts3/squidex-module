import { Squidex } from './core/squidex'
import { initStore } from './core/storage'

const squidex = new Squidex()

export default (ctx, inject) => {
  if (process.server) {
    inject('squidex', squidex)
  }
  initStore(ctx)

  if (process.server) {
    ctx.beforeNuxtRender(async ({ Components, nuxtState }) => {
      await ctx.store.dispatch('squidex/initialize')
    })
  }
}
