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

  it('should return 204', async () => {
    const response = await fetch('http://localhost:3000/api/v1/sessions', {
      method: 'POST',
      body: JSON.stringify({
        email: 'teste@gmail.com',
        password: '123456'
      })
    })
    expect(response.status).toBe(201)

    const responseBody = await response.json()

    const responseDelete = await fetch(
      `http://localhost:3000/api/v1/sessions/${responseBody.id}`,
      {
        method: 'DELETE',
        credentials: 'include'
      }
    )

    expect(responseDelete.status).toBe(204)
  })
})
