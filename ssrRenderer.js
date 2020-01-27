const { createBundleRenderer } = require('vue-server-renderer')
const template = require('fs').readFileSync('layout.html', 'utf-8')
let renderer = null, resolve = null, clientBundle = {}, serverBundle = ''
// var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';

if (process.env.NODE_ENV === 'production') {
    const serverBundle = require('./dist/vue-ssr-server-bundle.json')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    renderer = createBundleRenderer(serverBundle, {
        runInNewContext: false,
        template,
        clientManifest
    })
} else {
    const webpack = require('webpack')
    const serverConfig = require('./webpack.server.config.js')
    const clientConfig = require('./webpack.client.config.js')
    const mfs = new (require('memory-fs'))()
    const update = () => {
        if (Object.keys(clientBundle).every(key => clientBundle[key]) && serverBundle) {
            console.log(`i ｢wdm｣: Compiled successfully.`);
            renderer = createBundleRenderer(serverBundle, {
                runInNewContext: false,
                template,
                clientManifest: clientBundle['manifest']
            })
            resolve && resolve(renderer)
        }
    }
    const readFile = (fs, file) => {
        try {
            return fs.readFileSync('/mem/' + file, 'utf-8')
        } catch (e) {
            console.log('read file err', e);
        }
    }

    // client
    const clientCompiler = webpack(clientConfig)
    clientCompiler.outputFileSystem = mfs
    clientCompiler.watch({}, (err, stats) => {
        console.log('clientCompiler watch', stats.toString({ colors: true }));
        if (err) throw err
        stats = stats.toJson()
        if (stats.errors.length) return

        clientBundle['manifest'] = JSON.parse(readFile(mfs, 'vue-ssr-client-manifest.json'))
        clientBundle['main'] = readFile(mfs, 'main.js')
        clientBundle['0'] = readFile(mfs, '0.js')
        update()
    })

    // server
    const serverCompiler = webpack(serverConfig)
    serverCompiler.outputFileSystem = mfs
    serverCompiler.watch({}, (err, stats) => {
        console.log('serverCompiler watch', stats.toString({ colors: true }));
        if (err) throw err
        stats = stats.toJson()
        if (stats.errors.length) return

        serverBundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json', true))
        update()
    })

}

exports.staticConfig = [/^\/(0|main)\.js$/, (req, res) => {
    res.end(clientBundle[req.path.match(/^\/(0|main)\.js$/)[1]])
}]
exports.getSsrRenderer = () => new Promise(res => {
    if (renderer) res(renderer);
    else resolve = res
})