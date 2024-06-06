import database from '@/infra/database'
import { beforeAll, it, describe, expect } from 'vitest'

const userSut = {
  name: 'test',
  password: '123456',
  email: 'test@gmail.com'
}

beforeAll(cleanDatabase)

async function cleanDatabase() {
  await database.query({
    text: 'drop schema public cascade; create schema public;'
  })
  await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'POST'
  })
  await fetch('http://localhost:3000/api/v1/users', {
    method: 'POST',
    body: JSON.stringify({
      name: userSut.name,
      password: userSut.password,
      email: userSut.email
    })
  })
}

describe('POST /api/v1/users', () => {
  it('should return 200', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/users?' +
        new URLSearchParams({
          email: userSut.email
        })
    )

    expect(response.status).toBe(200)

    const responseBody = await response.json()

    expect(Array.isArray(responseBody.data)).toBe(true)
    expect(responseBody.data.length).toBe(1)
    expect(responseBody.pagination.page).toBe(1)
    expect(responseBody.pagination.limit).toBe(10)
    expect(responseBody.pagination.totalRows).toBe(1)
    expect(responseBody.pagination.totalPages).toBe(1)
  })

  it('should return 200 with empty array when not found', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/users?' +
        new URLSearchParams({
          email: 'invalid-email'
        })
    )

    expect(response.status).toBe(200)

    const responseBody = await response.json()

    expect(Array.isArray(responseBody.data)).toBe(true)
    expect(responseBody.data.length).toBe(0)
    expect(responseBody.pagination.page).toBe(1)
    expect(responseBody.pagination.limit).toBe(10)
    expect(responseBody.pagination.totalRows).toBe(0)
    expect(responseBody.pagination.totalPages).toBe(0)
  })
})
