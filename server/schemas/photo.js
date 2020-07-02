
const sendPhotoFromPipefy = {
  description: 'Envia uma foto para o instagram',
  body: {
    type: 'object',
    required: ['photoUrl', 'description', 'cardId'],
    properties: {
      photoUrl: { type: 'string' },
      description: { type: 'string' },
      cardId: { type: ['string', 'number'] }
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

module.exports = { sendPhotoFromPipefy }
