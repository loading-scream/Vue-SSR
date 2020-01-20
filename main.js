// 导入Vue
const Vue = require('vue')
// 创建App
const app = new Vue({
    template: `<div>Hello World</div>`
})

// 导入SSR工具
const renderer = require('vue-server-renderer').createRenderer()

// 使用ssr工具把app渲染成html(这里是服务端代码) 
renderer.renderToString(app, (err, html) => {
    if (err) throw err
    console.log(html);
})

// 不传callback时, 返回Promise
renderer.renderToString(app)
    .then(html => console.log(html))
    .catch(err => console.log(err))


