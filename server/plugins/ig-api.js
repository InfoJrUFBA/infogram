'use strict'

const fp = require('fastify-plugin')
const { IgApiClient } = require('instagram-private-api')
const { readJson, writeJson } = require('fs-extra')

module.exports = fp(async function (fastify, opts) {
  const { userName, password } = opts
  const ig = new IgApiClient()
  ig.state.generateDevice(userName)

  ig.request.end$.subscribe(async () => {
    const serialized = await ig.state.serialize()
    delete serialized.constants // this deletes the version info, so you'll always use the version provided by the library
    writeJson(`${userName}-ig-cache.json`, serialized)
  })

  const [data, error] = await goWay(() => readJson(`${userName}-ig-cache.json`))

  if (error === null) {
    await ig.state.deserialize(data)
  }

  async function login () {
    await ig.simulate.preLoginFlow()
    const loggedInUser = await ig.account.login(userName, password)
    process.nextTick(async () => await ig.simulate.postLoginFlow())
    return loggedInUser
  }

  fastify.decorate('ig', {
    api: ig,
    login
  })
}, {
  name: 'ig-api'
})

module.exports.autoConfig = {
  userName: process.env.INSTAGRAM_LOGIN,
  password: process.env.INSTAGRAM_PASSWORD
}

async function goWay (func) {
  try {
    const result = await func()
    return [result, null]
  } catch (error) {
    return [null, error]
  }
}
