const { staticConfig, getSsrRenderer } = require('./ssrRenderer')
const express = require('express')
const server = express()

server.use(require('serve-favicon')(require('path').join(__dirname, 'src', 'favicon.ico')))
if (process.env.NODE_ENV === 'production') {
    server.use(express.static('./dist'))
} else {
    server.get(...staticConfig)
}

server.get("*", async (req, res) => {
    const context = req
    const renderer = await getSsrRenderer()
    try {
        const html = await renderer.renderToString(context)
        res.header('content-type', 'text/html')
        res.end(html)
    } catch (error) {
        res.status(error.code).json(error)
    }
})

server.listen(4000, async () => {
    await getSsrRenderer()
    require('open')('http://localhost:4000')
    console.log('listen in port 4000');
})
