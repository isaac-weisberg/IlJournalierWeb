const config = require('./builddev.config.js')

module.exports = {
    ...config,
    devServer: {
        ...config.devServer,
        server: {
            ...config.devServer.server,
            type: 'http'
        }
    }
}