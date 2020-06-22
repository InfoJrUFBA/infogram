'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function(req, reply) {
    return { root: true }
  })
}
