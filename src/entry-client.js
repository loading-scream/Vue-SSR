// 仅运行于浏览器
// 客户端 entry 只需创建应用程序，并且将其挂载到 DOM 中：

import { createApp } from './factory/app'

const { app, router } = createApp()

router.onReady(() => {
  app.$mount('#app')
})