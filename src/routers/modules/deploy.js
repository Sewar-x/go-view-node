'use strict'

module.exports = (app, router) => {
    router.post('/api/goview/deploy/wehook', app.controllers.deploy.webhook);
    return router
}
