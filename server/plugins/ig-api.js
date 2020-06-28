'use strict'

const fp = require('fastify-plugin')
const { IgApiClient } = require('instagram-private-api')
const { readJson, writeJson, ensureDir } = require('fs-extra')
const { join } = require('path')

module.exports = fp(async function (fastify, { userName, password }) {
  const ig = new IgApiClient()
  ig.state.generateDevice(userName)

  await ensureDir('ig-cache')
  const fileName = join('ig-cache', `${userName}.json`)

  ig.request.end$.subscribe(async () => {
    const serialized = await ig.state.serialize()
    delete serialized.constants // this deletes the version info, so you'll always use the version provided by the library
    writeJson(fileName, serialized)
  })

  const [data, error] = await goWay(() => readJson(fileName))

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
