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

describe('DELETE /api/v1/users', () => {
  it('should return 204', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/users/${existingUser.id}`,
      {
        method: 'DELETE'
      }
    )

    expect(response.status).toBe(204)
  })

  it('should return 404 when user is not found', async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/users/${existingUser.id}`,
      {
        method: 'DELETE'
      }
    )

    expect(response.status).toBe(404)

    const responseBody = await response.json()

    expect(responseBody.error).toBe('User not found')
  })
})
