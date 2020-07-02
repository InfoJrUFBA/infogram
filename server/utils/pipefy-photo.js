const { CookieJar } = require('tough-cookie')
const cheerio = require('cheerio')
const got = require('got')

export async function pipefyPhotoDownloader (imageUrl) {
  try {
    const cookieJar = new CookieJar()
    const loginCredential = await got.post('https://auth.pipefy.com/co/authenticate', {
      json: {
        client_id: 'BNvxvh6gPAsxy2iSKcMMZN5qgwMU6x1y',
        credential_type: 'http://auth0.com/oauth/grant-type/password-realm',
        realm: 'Pipefy-Database',
        username: process.env.PIPEFY_LOGIN,
        password: process.env.PIPEFY_PASSWORD
      },
      headers: {
        Origin: 'https://app-auth.pipefy.com'
      },
      responseType: 'json',
      resolveBodyOnly: true,
      cookieJar
    })

    const { body } = await got('https://auth.pipefy.com/authorize', {
      headers: {
        Origin: 'https://app-auth.pipefy.com'
      },
      searchParams: {
        client_id: 'BNvxvh6gPAsxy2iSKcMMZN5qgwMU6x1y',
        response_type: 'token',
        response_mode: 'form_post',
        redirect_uri: 'https://app-auth.pipefy.com/callback?app=BNvxvh6gPAsxy2iSKcMMZN5qgwMU6x1y&afterLoginRedirectTo=&redirectedFrom=https%3A%2F%2Fapp-auth.pipefy.com%2Flogin%3FafterLoginRedirectTo%3D',
        connection: 'Pipefy-Database',
        state: 'OJlA0eKyIokymqFahQVOAecGV1TaIVdC',
        scope: 'openid profile email',
        realm: 'Pipefy-Database',
        login_ticket: loginCredential.login_ticket,
        auth0Client: 'eyJuYW1lIjoibG9jay5qcyIsInZlcnNpb24iOiIxMS45LjAiLCJsaWJfdmVyc2lvbiI6eyJyYXciOiI5LjcuMyJ9fQ=='
      },
      cookieJar
    })

    const $ = cheerio.load(body)
    const idToken = $('input[name=id_token]')[0].attribs.value

    return await got(imageUrl, {
      responseType: 'buffer',
      resolveBodyOnly: true,
      headers: {
        cookie: `id_token=${idToken}`
      }
    })
  } catch (e) {
    console.error(e)
  }
}
