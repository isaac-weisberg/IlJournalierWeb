const config = require('./build.config')

module.exports = {
    ...config,
    optimization: {
        usedExports: false,
    },
    mode: 'production'
}