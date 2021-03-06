'use strict'

const { create, init } = require('../schemas/schedule')

module.exports = async function (fastify, opts) {
  const { got } = fastify

  fastify.post('/schedule', { schema: create }, async function ({ body }, reply) {
    await got.agendarest.post('once', {
      json: {
        name: 'send-photo',
        interval: body.date,
        data: {
          body: {
            photoUrl: body.photoUrl,
            description: body.description
          }
        }
      }
    })
    return { sucess: true }
  })

  fastify.get('/init', { schema: init }, async function (req, reply) {
    await got.agendarest.delete('send-photo').catch(res => null)
    await got.agendarest.post('', {
      json: {
        name: 'send-photo',
        url: `${process.env.SELF_ADRESS}/send-photo-from-pipefy`
      }
    })
    return { sucess: true }
  })
}
