
module.exports = {
    development: require('./development'),
    test: require('./test'),
    production: require('./production')
}[process.env.NODE_ENV || 'development']