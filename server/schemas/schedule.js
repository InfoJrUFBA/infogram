const create = {
  body: {
    type: 'object',
    properties: {
      date: { type: 'string', format: 'date-time' },
      photoUrl: { type: 'string' },
      description: { type: 'string' }
    }
  }
}

module.exports = { create }
