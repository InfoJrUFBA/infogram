'use strict'

const { cardUpdate } = require('../schemas/pipefy')
const parse = require('date-fns/parse')
const formatISO = require('date-fns/formatISO')
const { zonedTimeToUtc } = require('date-fns-tz')
const { URL } = require('url')

module.exports = async function (fastify, opts) {
  const { got } = fastify

  fastify.post('/card-update', { schema: cardUpdate }, async function ({ body: { data } }, reply) {
    const cardId = data.card.id

    if (data.field.id !== 'deve_postar') return { sucess: false }

    await got.agendarest.post('cancel', {
      json: {
        'data.body.cardID': String(cardId)
      }
    })

    if (data.new_value !== 'SIM') return { canceled: true }

    const { data: { card } } = await got.pipefy.post('', {
      json: {
        query: `
                {
                  card(id: ${cardId}) {
                    due_date
                    fields {
                      array_value
                      assignee_values {
                        name
                      }
                      date_value
                      datetime_value
                      field {
                        description
                        label
                        type
                        id
                      }
                      phase_field {
                        id
                      }
                      value
                    }
                  }
                }
            `
      }
    })

    const publicationDateField = card.fields.find(e => e.field.id === 'data_e_hora_de_publica_o')
    const imagemField = card.fields.find(e => e.field.id === 'imagem')
    const descriptionField = card.fields.find(e => e.field.id === 'descri_o_da_foto')

    const url = new URL(JSON.parse(imagemField.value)[0])
    const imagePath = url.pathname.split('/').slice(-2).join('/')

    const description = descriptionField.value
    const parsedDate = parse(publicationDateField.value, 'dd/MM/yyyy HH:mm', new Date())
    const zonedDate = zonedTimeToUtc(parsedDate, 'America/Sao_Paulo')

    await got.agendarest.post('once', {
      json: {
        name: 'send-photo',
        interval: formatISO(zonedDate),
        data: {
          body: {
            photoUrl: `https://app-storage-service.pipefy.com/v1/resources/cards-v1/45818252/uploads/${imagePath}`,
            description,
            cardId
          }
        }
      }
    })
    return { sucess: true }
  })
}
