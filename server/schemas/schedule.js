const create = {
  description: 'Cria um schedule para enviar a foto',
  body: {
    type: 'object',
    properties: {
      date: { type: 'string', format: 'date-time' },
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

const init = {
  description: 'cria o job para o schedule (interno)',
  response: {
    200: {
      type: 'object',
      properties: {
        sucess: { type: 'boolean' }
      }
    }
  }
}

module.exports = { create, init }
