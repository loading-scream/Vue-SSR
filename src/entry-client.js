// 仅运行于浏览器
// 客户端 entry 只需创建应用程序，并且将其挂载到 DOM 中：
import Vue from 'vue'
import { createApp } from './factory/app'

const { app, router, store } = createApp()
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {

  /* 多选一 推荐 数据好了再渲染方案 开loader */
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    // 我们只关心非预渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    let diffed = false
    // (猜测matched prevMatched都是组件及其子组件, 遇到首个不同, 就整个子树更新)
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    if (!activated.length) {
      return next()
    }

    // 这里如果有加载指示器 (loading indicator)，就触发

    Promise.all(activated.map(c => {
      if (c.asyncData) {
        return c.asyncData({ store, route: to })
      }
    })).then(() => {

      // 停止加载指示器(loading indicator)

      next()
    }).catch(next)
  })

  app.$mount('#app')
})

/* 多选一 先进组件再慢慢渲染数据 */
// 此策略将客户端数据预取逻辑，放在视图组件的 beforeMount 函数中。
// 当路由导航被触发时，可以立即切换视图，因此应用程序具有更快的响应速度。
// 然而，传入视图在渲染时不会有完整的可用数据。
// 因此，对于使用此策略的每个视图组件，都需要具有条件加载状态。
/*
Vue.mixin({
  beforeMount() {
    const { asyncData } = this.$options
    if (asyncData) {
      // 将获取数据操作分配给 promise
      // 以便在组件中，我们可以在数据准备就绪后
      // 通过运行 `this.dataPromise.then(...)` 来执行其他任务
      this.dataPromise = asyncData({
        store: this.$store,
        route: this.$route
      })
    }
  }
})
*/

// 组件重用场景也要更新 如现在的列表页
Vue.mixin({
  beforeRouteUpdate (to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to
      }).then(next).catch(next)
    } else {
      next()
    }
  }
})