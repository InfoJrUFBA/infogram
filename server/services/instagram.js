'use strict'

const { IgCheckpointError } = require('instagram-private-api')
const { sendPhotoFromPipefy } = require('../schemas/photo')
const { pipefyPhotoDownloader } = require('../utils/pipefy-photo')

module.exports = async function (fastify, opts) {
  const { got, ig } = fastify

  fastify.post('/send-photo-from-pipefy', { schema: sendPhotoFromPipefy }, async function ({ body }, reply) {
    const { photoUrl, description, cardId } = body
    const photo = await pipefyPhotoDownloader(photoUrl)
    await ig.api.publish.photo({
      file: photo,
      caption: description.replace(/(?:\r\n|\r|\n)/g, '\u2063\n')
    })
    got.pipefy.post('', {
      json: {
        query: `
          mutation {
            moveCardToPhase(input: {
              card_id: ${cardId}
              destination_phase_id: 4573195
            }) {
              card {
                id
                title
              }
            }
          }
        `
      }
    })
    return { sucess: 'ok' }
  })

  fastify.get('/login-ui', { schema: { hide: true } }, (req, reply) => {
    reply.view('/templates/index.art', { url: process.env.SELF_ADRESS })
  })

  fastify.get('/login-ig', { websocket: true, schema: { hide: true } }, (conn, req) => {
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
          console.log(e)
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
  })
}
// { "type": "init" }
// { "type": "code", "message": ""}
