'use strict'

module.exports = (app, router) => {
    router.get('/deploy/wehook', app.controllers.deploy.webhook);
    return router
}
