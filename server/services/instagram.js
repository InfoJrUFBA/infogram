'use strict'

const { IgCheckpointError } = require('instagram-private-api')
const { sendPhoto } = require('../schemas/photo')

module.exports = async function (fastify, opts) {
  const { got, ig } = fastify

  fastify.post('/send-photo', { schema: sendPhoto }, async function ({ body }, reply) {
    const { photoUrl, description } = body
    const photo = await got.photoDownloader(photoUrl)
    await ig.api.publish.photo({
      file: photo,
      caption: description.replace(/(?:\r\n|\r|\n)/g, '\u2063\n')
    })
    return { sucess: 'ok' }
  })

  fastify.route({
    method: 'GET',
    url: '/login-ig',
    handler: (req, reply) => {
      reply.sendFile('index.html')
    },
    wsHandler: (conn, req) => {
      function makeWsPromise (type) {
        return new Promise((resolve, reject) => {
          conn.socket.on('message', rawMessage => {
            const message = JSON.parse(rawMessage)
            if (message.type === type) { resolve(message) }
          })
        })
      }

      function sendMessage (type, message, detail = 'nenhum') {
        conn.socket.send(JSON.stringify({ type, message, detail }))
      }

      makeWsPromise('init').then(async res => {
        ig.login()
          .then(() => sendMessage('response', 'sucess'))
          .catch(async (e) => {
            if (e instanceof IgCheckpointError) {
              sendMessage('error', 'checkpoint err, need code', { err: e, stack: e.stack })
              await ig.api.challenge.auto(true) // Requesting sms-code or click "It was me" button
              const { message } = await makeWsPromise('code')
              await ig.api.challenge.sendSecurityCode(message)
              sendMessage('response', 'sucess')
            }
          })
          .catch((e) => {
            sendMessage('error', 'Could not resolve checkpoint', { err: e, stack: e.stack })
          })
      })
    }
  })
}
// { "type": "init" }
// { "type": "code", "message": ""}
