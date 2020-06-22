'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = function (fastify, opts, next) {
  fastify
    .register(require('fastify-cors'))
    .register(require('fastify-helmet'))
    .register(require('fastify-websocket'))
    .register(require('fastify-static'), {
      root: path.join(__dirname, 'public')
    })
    .register(require('fastify-oas'), {
      routePrefix: '/documentation',
      swagger: {
        info: {
          title: 'Test openapi',
          description: 'testing the fastify swagger api',
          version: '0.1.0'
        },
        externalDocs: {
          url: 'https://swagger.io',
          description: 'Find more info here'
        },
        consumes: ['application/json'],
        produces: ['application/json']
      },
      exposeRoute: true
    })

  fastify.ready(err => {
    if (err) throw err
    fastify.oas()
  })

  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in services
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({}, opts)
  })

  // Make sure to call next when done
  next()
}
