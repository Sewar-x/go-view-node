'use strict'
const { webhook } = require('../../../deploy/webhook')
module.exports = (app, router) => {
    router.post('/api/goview/deploy/wehook', webhook);
    return router
}
