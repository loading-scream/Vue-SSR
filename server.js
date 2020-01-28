const { devStaticMid, getSsrRenderer } = require('./ssrRenderer')
const app = new (require('koa'))()

app.use(require('koa-favicon')(__dirname + '/src/favicon.ico'))

if (process.env.NODE_ENV === 'production') {
    app.use(require('koa-static')('./dist'))
} else {
    app.use(devStaticMid)
}

app.use(async ctx => {
    const renderer = await getSsrRenderer()
    try {
        const html = await renderer.renderToString(ctx)
        ctx.body = html
    } catch (error) {
        console.log(error)
    }
})
app.listen(4000, async () => {
    await getSsrRenderer()
    require('open')('http://127.0.0.1:4000')
    console.log('listen in port 4000');
})
