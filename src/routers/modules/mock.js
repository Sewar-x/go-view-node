'use strict'

module.exports = (app, router) => {
    router.get('/api/goview/mock/getBarChart', app.controllers.mock.getBarChart);
    router.get('/api/goview/mock/getLineChart', app.controllers.mock.getLineChart);
    router.get('/api/goview/mock/getRankChart', app.controllers.mock.getRankChart);
    router.get('/api/goview/mock/getPieChart', app.controllers.mock.getPieChart);
    router.get('/api/goview/mock/getRadarChart', app.controllers.mock.getRadarChart);
    return router
}
