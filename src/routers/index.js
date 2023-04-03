'use strict'
const { PERFIX } = require('../config')

/**
 * 自动注册所有路由
 * @param {*} app
 * @param {*} router
 */
const registerRouters = (app, router) => {
  const routers = app.routers
  for (let routeKey in routers) {
    router.use(PERFIX, routers[routeKey](app))
  }
}

module.exports = app => {
  const express = require('express')
  const router = express.Router() //路由器层中间件
  registerRouters(app, router) //自动注册所有路由
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to low-code-node application.' })
  })
  app.use(router)
}
