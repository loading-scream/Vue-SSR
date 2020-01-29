const { createBundleRenderer } = require('vue-server-renderer')
const template = require('fs').readFileSync('layout.html', 'utf-8')
let renderer = null, resolve = null, Bundles = {}, reg = /.*/

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
    const readFile = () => {
        try {
            const fileList = mfs.readdirSync(__dirname + '/dist');
            fileList.forEach(file => {
                Bundles[file.replace(/\.\w+$/, "")] = mfs.readFileSync(__dirname + '/dist/' + file, 'utf-8')
            })
            console.log('FileList: \n', Object.keys(Bundles).filter(b => Bundles[b]));
            reg = new RegExp('^/(' + fileList.join('|') + ')$')
        } catch ({message,path}) {
            throw(message + '\npath: ' + path)
        }
    }
    const update = (() => {
        const readyBundle = []
        return (endSide) => {
            readyBundle.push(endSide)
            if (readyBundle.length < 2) return
            readFile()
            console.log('\nCompiled successfully..');
            renderer = createBundleRenderer(JSON.parse(Bundles['vue-ssr-server-bundle']), {
                runInNewContext: false,
                template,
                clientManifest: JSON.parse(Bundles['vue-ssr-client-manifest'])
            })
            resolve && resolve(renderer)
        }
    })()

    // client
    const clientCompiler = webpack(clientConfig)
    clientCompiler.outputFileSystem = mfs
    clientCompiler.watch({}, (err, stats) => {
        console.log(stats.toString({ colors: true }));
        console.log("[Client] Build Successfully\n")
        if (err) throw err
        stats = stats.toJson()
        if (stats.errors.length) return
        update('client')
    })

    // server
    const serverCompiler = webpack(serverConfig)
    serverCompiler.outputFileSystem = mfs
    serverCompiler.watch({}, (err, stats) => {
        console.log(stats.toString({ colors: true }));
        console.log("[Server] Build Successfully\n")
        if (err) throw err
        stats = stats.toJson()
        if (stats.errors.length) return
        update('server')
    })

}

exports.devStaticMid = async (ctx, next) => {
    if (reg.test(ctx.path)) {
        ctx.body = Bundles[ctx.path.match(reg)[1].replace(/\.\w+$/, "")]
    }
    else await next()
}
exports.getSsrRenderer = () => new Promise(res => {
    if (renderer) res(renderer);
    else resolve = res
})