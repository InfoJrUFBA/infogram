const cardUpdate = {
  description: 'Escuta o hook do pipefy',
  response: {
    200: {
      type: 'object',
      properties: {
        sucess: { type: 'boolean' }
      }
    }
  }
}

module.exports = { cardUpdate }
