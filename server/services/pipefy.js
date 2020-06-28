'use strict'

const { cardUpdate } = require('../schemas/pipefy')
const parse = require('date-fns/parse')
const formatISO = require('date-fns/formatISO')

module.exports = async function (fastify, opts) {
  const { got } = fastify

  fastify.post('/card-update', { schema: cardUpdate }, async function ({ body: { data } }, reply) {
    const cardId = data.card.id

    if (data.field.id !== 'deve_postar') return { sucess: false }

    await got.agendarest.post('cancel', {
      json: {
        "data.body.cardID": String(cardID)
      }
    })

    if(data.new_value !== 'SIM') return { canceled: true }

    const { data: card } = await got.pipefy.post('', {
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

    const publicationDateField = card.fields.find(e => e.field.id === 'data_de_publicacao')
    const imagemField = card.fields.find(e => e.field.id === 'imagem')
    const descriptionField = card.fields.find(e => e.field.id === 'descri_o_1')

    const [photoUrl] = JSON.parse(imagemField.value)
    const description = descriptionField.value
    const interval = formatISO(parse(publicationDateField.value, 'dd/MM/yyyy HH:mm', new Date()))

    await got.agendarest.post('once', {
      json: {
        name: 'send-photo',
        interval,
        data: {
          body: {
            photoUrl,
            description,
            cardId
          }
        }
      }
    })
    return { sucess: true }
  })
}
