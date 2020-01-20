// 导入Vue
const Vue = require('vue')
// 导入SSR工具
const renderer = require('vue-server-renderer').createRenderer({
    // H5页面基本架构抽离到模板, utf-8格式读取模板, ssr识别坑位自动拼接好html
    template: require('fs').readFileSync('layout.html', 'utf-8')
})
// 导入 web 服务器框架
const server = require('express')()

// 写一个正则路由
server.get(/^\/index\/(p-(\d+))?$/, (req, res) => {
    console.log(req.url);
    const app = new Vue({
        data: {
            url: req.url,
            query: req.query,
            params: req.params
        },
        template: `<div>
            <div>访问URL: {{url}}</div>
            <div>请求query参数: {{query}}</div>
            <div>请求params参数: {{params}}</div>
        </div>`
    })
    // 模板也支持插值, 要单独写出来不能放app中, 类似模板专用的data
    const context = {
        title: req.query.title,
        meta: `<meta charset="UTF-8">`
    }
    // 使用ssr工具把app渲染成html(这里是服务端代码) 
    renderer.renderToString(app, context, (err, html) => {
        if (err) return res.status(500).end('Internal Server Error: ' + err)
        res.header('content-type', 'text/html') //中文处理
        res.end(html)
    })
})

// 再写一个正则路由
server.get(/^\/user\/(p-(\d+))?$/, (req, res) => {
    console.log(req.url);
    // 创建App (每个请求来自不同客户端, 必须重新创建app防止状态污染, 上同)
    const app = new Vue({
        data: {
            url: req.url,
            query: req.query,
            params: req.params
        },
        template: `<div>
            <div>访问URL: {{url}}</div>
            <div>请求query参数: {{query}}</div>
            <div>请求params参数: {{params}}</div>
        </div>`
    })
    const context = {
        title: req.query.title,
        meta: `<meta charset="UTF-8">`
    }
    renderer.renderToString(app, context)
        .then(html => {
            res.header('content-type', 'text/html')
            res.end(html)
        })
        .catch(err => err && res.status(500).end('Internal Server Error: ' + err))
})

server.listen(8080, () => {
    console.log('listen in port 8080');
})
