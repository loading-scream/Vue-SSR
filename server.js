// 导入APP工厂函数
const createApp = require('./dist/server')  //其实还没好 还要改webpack配置
// 导入SSR工具
const renderer = require('vue-server-renderer').createRenderer({
    // H5页面基本架构抽离到模板, utf-8格式读取模板, ssr识别坑位自动拼接好html
    template: require('fs').readFileSync('layout.html', 'utf-8')
})
// 导入 web 服务器框架
const server = require('express')()

// 通配路由, 转交给 vue router 处理
server.get("*", (req, res) => {
    // 创建App (每个请求来自不同客户端, 必须重新创建app防止状态污染, 上同)
    const context = {
        title: req.query.title,
        meta: `<meta charset="UTF-8">`
    }
    createApp({ req, res }).then(app => {
        renderer.renderToString(app, context)
            .then(html => {
                res.header('content-type', 'text/html')
                res.end(html)
            })
            .catch(err => err && res.status(err.code).end(err))
    })
})

server.listen(8080, () => {
    console.log('listen in port 8080');
})
