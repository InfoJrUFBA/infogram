'use strict'

module.exports = async function (fastify, opts) {
  fastify.post('/pipefy-hooks', async function (req, reply) {
    console.log(req.body)
    return { root: true }
  })
}
