const { createBundleRenderer } = require('vue-server-renderer')
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const template = require('fs').readFileSync('layout.html', 'utf-8')

const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template,
    clientManifest
})

const express = require('express')
const server = express()

server.use(require('serve-favicon')(require('path').join(__dirname, 'src', 'favicon.ico')))
server.use(express.static('./dist'))

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
