import database from '@/infra/database'
import { beforeAll, describe, expect, it } from 'vitest'

async function cleanDatabase() {
  await database.query({
    text: 'drop schema public cascade; create schema public;'
  })
  await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'POST'
  })
}

describe('POST /api/v1/session', () => {
  beforeAll(async () => {
    await cleanDatabase()
    await fetch('http://localhost:3000/api/v1/users', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        name: 'Teste',
        email: 'teste@gmail.com',
        password: '123456'
      })
    })
  })

  it('should return 201', async () => {
    const response = await fetch('http://localhost:3000/api/v1/sessions', {
      method: 'POST',
      body: JSON.stringify({
        email: 'teste@gmail.com',
        password: '123456'
      })
    })

    expect(response.status).toBe(201)

    const responseBody = await response.json()

    expect(responseBody.id).toBeTruthy()
    expect(responseBody.token).toBeTruthy()
    expect(responseBody.user_id).toBeTruthy()
    expect(responseBody.expires_at).toBeTruthy()
    expect(responseBody.created_at).toBeTruthy()
    expect(responseBody.updated_at).toBeTruthy()
  })

  it('should return 401 when credentials are invalid', async () => {
    const response = await fetch('http://localhost:3000/api/v1/sessions', {
      method: 'POST',
      body: JSON.stringify({
        email: 'teste@gmail.com',
        password: '12345678'
      })
    })
    expect(response.status).toBe(401)

    const responseBody = await response.json()

    expect(responseBody.error).toBe('Credenciais Inválidas')
  })
})
