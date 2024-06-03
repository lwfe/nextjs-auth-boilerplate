class BaseError extends Error {
  statusCode: number

  constructor({
    name,
    message,
    statusCode
  }: {
    name: string
    message: string
    statusCode: number
  }) {
    super()
    this.name = name
    this.message = message
    this.statusCode = statusCode || 500
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super({ message, name: 'UnauthorizedError', statusCode: 401 })
  }
}
