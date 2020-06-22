
const sendPhoto = {
  body: {
    type: 'object',
    required: ['photoUrl', 'description'],
    properties: {
      photoUrl: { type: 'string' },
      description: { type: 'string' }
    }
  }
}

module.exports = { sendPhoto }
