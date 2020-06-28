
const sendPhoto = {
  description: 'Envia uma foto para o instagram',
  body: {
    type: 'object',
    required: ['photoUrl', 'description'],
    properties: {
      photoUrl: { type: 'string' },
      description: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        sucess: { type: 'boolean' }
      }
    }
  }
}

module.exports = { sendPhoto }
