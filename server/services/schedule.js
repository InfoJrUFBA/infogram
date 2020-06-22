'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/schedule', async function(req, reply) {
    return { root: true }
  })
}
