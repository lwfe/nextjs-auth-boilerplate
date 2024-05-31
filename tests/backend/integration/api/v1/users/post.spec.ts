import { IUser } from '@/models/user'
import database from '@/infra/database'
import { beforeAll, it, describe, expect } from 'vitest'

beforeAll(cleanDatabase)

async function cleanDatabase() {
  await database.query({
    text: 'drop schema public cascade; create schema public;'
  })
  await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'POST'
  })
}

const userSut = {
  name: 'test',
  password: '123456',
  email: 'test@gmail.com'
}

describe('POST /api/v1/users', () => {
  it('should return 201', async () => {
    const response = await fetch('http://localhost:3000/api/v1/users', {
      method: 'POST',
      body: JSON.stringify({
        name: userSut.name,
        password: userSut.password,
        email: userSut.email
      } as IUser)
    })

    expect(response.status).toBe(201)

    const responseBody = await response.json()

    expect(responseBody.id).toBeTruthy()
    expect(responseBody.name).toBe(userSut.name)
    expect(responseBody.email).toBe(userSut.email)
    expect(responseBody.password).toBeUndefined()
    expect(responseBody.created_at).toBeTruthy()
    expect(responseBody.updated_at).toBeTruthy()
    expect(responseBody.role).toBeTruthy()
  })

  it('should return 400 when email is invalid', async () => {
    const response = await fetch('http://localhost:3000/api/v1/users', {
      method: 'POST',
      body: JSON.stringify({
        name: userSut.name,
        password: userSut.password,
        email: 'test'
      } as IUser)
    })

    expect(response.status).toBe(400)

    const responseBody = await response.json()

    expect(responseBody.errors[0].email).toBe('Email inválido')
  })

  it('should return 400 when password is less than 6 characters', async () => {
    const response = await fetch('http://localhost:3000/api/v1/users', {
      method: 'POST',
      body: JSON.stringify({
        name: userSut.name,
        password: '12345',
        email: userSut.email
      } as IUser)
    })
    expect(response.status).toBe(400)

    const responseBody = await response.json()

    expect(responseBody.errors[0].password).toBe(
      'Senha deve ter pelo menos 6 digitos'
    )
  })

  it('should return 400 when name is empty', async () => {
    const response = await fetch('http://localhost:3000/api/v1/users', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        password: userSut.password,
        email: userSut.email
      } as IUser)
    })
    expect(response.status).toBe(400)

    const responseBody = await response.json()

    expect(responseBody.errors[0].name).toBe('Nome é obrigatório')
  })

  it("should return 400 if role is not in 'default' or 'admin'", async () => {
    const response = await fetch('http://localhost:3000/api/v1/users', {
      method: 'POST',
      body: JSON.stringify({
        name: userSut.name,
        password: userSut.password,
        email: userSut.email,
        role: 'test' as any
      } as IUser)
    })
    expect(response.status).toBe(400)

    const responseBody = await response.json()

    expect(responseBody.errors[0].role).toBe(
      "Role deve ser 'default' ou 'admin'"
    )
  })

  it('should return 409 when email is already in use', async () => {
    const response = await fetch('http://localhost:3000/api/v1/users', {
      method: 'POST',
      body: JSON.stringify({
        name: userSut.name,
        password: userSut.password,
        email: userSut.email
      } as IUser)
    })

    expect(response.status).toBe(409)

    const responseBody = await response.json()

    expect(responseBody.error).toBe(
      'Esse email já está sendo usado por outro usuário'
    )
  })
})
