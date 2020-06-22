'use strict'

const fp = require('fastify-plugin')
const got = require('got')

module.exports = fp(async function (fastify, opts) {
  const { clients = {}, ...args } = opts
  const clientsKeys = Object.keys(clients)

  if (clientsKeys.length === 0) { return fastify.decorate('got', got.extend({ ...args })) }

  fastify.decorate('got', clientsKeys.reduce((prev, current) =>
    Object.assign(prev, {
      [current]: got.extend(clients[current])
    })
  , {}))
}, {
  name: 'fastify-got'
})

module.exports.autoConfig = {
  clients: {
    pokeapi: {
      prefixUrl: 'https://pokeapi.co/api/v2',
      responseType: 'json',
      resolveBodyOnly: true
    },
    photoDownloader: {
      responseType: 'buffer',
      resolveBodyOnly: true
    },
    agendarest: {
      prefixUrl: process.env.AGENDA_API,
      responseType: 'text',
      resolveBodyOnly: true
    },
    none: {}
  }
}
