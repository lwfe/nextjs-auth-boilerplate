import { IUser } from '@/models/user'
import database from '@/infra/database'
import { beforeAll, it, describe, expect } from 'vitest'

beforeAll(cleanDatabase)

let existingUser: any

async function cleanDatabase() {
  await database.query({
    text: 'drop schema public cascade; create schema public;'
  })
  await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'POST'
  })
  existingUser = await fetch('http://localhost:3000/api/v1/users', {
    method: 'POST',
    body: JSON.stringify({
      name: 'test',
      password: '123456',
      email: 'test@gmail.com'
    } as IUser)
  }).then(res => res.json())
}

const userSut = {
  name: 'updated-test',
  email: 'updated@gmail.com',
  role: 'admin'
}

describe('PUT /api/v1/users', () => {
  it('should return 200', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/users/${existingUser.id}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          name: userSut.name,
          email: userSut.email,
          role: userSut.role
        } as IUser)
      }
    )

    expect(response.status).toBe(200)

    const responseBody = await response.json()

    expect(responseBody.id).toBe(existingUser.id)
    expect(responseBody.name).toBe(userSut.name)
    expect(responseBody.email).toBe(userSut.email)
    expect(responseBody.password).toBeUndefined()
    expect(responseBody.created_at).toBeTruthy()
    expect(responseBody.updated_at).toBeTruthy()
    expect(responseBody.role).toBe(userSut.role)
  })

  it('should return 400 when email is invalid', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/users/${existingUser.id}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          name: userSut.name,
          email: 'invalid-email',
          role: userSut.role
        } as IUser)
      }
    )

    expect(response.status).toBe(400)

    const responseBody = await response.json()

    expect(responseBody.errors[0].email).toBe('Email inválido')
  })

  it('should return 400 when role is invalid', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/users/${existingUser.id}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          name: userSut.name,
          email: userSut.email,
          role: 'invalid-role'
        } as unknown as IUser)
      }
    )
    expect(response.status).toBe(400)

    const responseBody = await response.json()

    expect(responseBody.errors[0].role).toBe(
      "Role deve ser 'default' ou 'admin'"
    )
  })

  it('should return 400 when name is empty', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/users/${existingUser.id}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          name: '',
          email: userSut.email,
          role: userSut.role
        } as IUser)
      }
    )
    expect(response.status).toBe(400)

    const responseBody = await response.json()

    expect(responseBody.errors[0].name).toBe('Nome é obrigatório')
  })

  it('should return 404 when user is not found', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/users/${existingUser.id}invalid`,
      {
        method: 'PUT',
        body: JSON.stringify({
          name: userSut.name,
          email: userSut.email,
          role: userSut.role
        } as IUser)
      }
    )

    expect(response.status).toBe(404)

    const responseBody = await response.json()

    expect(responseBody.error).toBe('User not found')
  })
})
