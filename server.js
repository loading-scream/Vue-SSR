// 导入APP工厂函数
const { createBundleRenderer } = require('vue-server-renderer')
const bundle = require('./dist/vue-ssr-server-bundle.json')
const renderer = createBundleRenderer(bundle, {
    runInNewContext: false,
    // H5页面基本架构抽离到模板, utf-8格式读取模板, ssr识别坑位自动拼接好html
    template: require('fs').readFileSync('layout.html', 'utf-8'),
})

// 导入 web 服务器框架
const server = require('express')()

server.use(require('serve-favicon')(require('path').join(__dirname, 'src', 'favicon.ico')))

// 通配路由, 转交给 vue router 处理
server.get("*", (req, res) => {
    const context = req
    // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
    // 现在我们的服务器与应用程序已经解耦！
    renderer.renderToString(context)
        .then(html => {
            res.header('content-type', 'text/html')
            res.end(html)
        }).catch(err => res.json(err))
})

server.listen(8080, () => {
    console.log('listen in port 8080');
})
