import database from '@/infra/database'
import { beforeAll, it, describe, expect } from 'vitest'

beforeAll(cleanDatabase)

async function cleanDatabase() {
  await database.query({
    text: 'drop schema public cascade; create schema public;'
  })
}

describe('POST /api/v1/migrations', () => {
  it('should return 200', async () => {
    const response = await fetch('http://localhost:3000/api/v1/migrations', {
      method: 'POST'
    })
    expect(response.status).toBe(201)

    const responseBody = await response.json()

    expect(Array.isArray(responseBody)).toBe(true)
    expect(responseBody.length).toBeGreaterThan(0)

    const response2 = await fetch('http://localhost:3000/api/v1/migrations')
    expect(response2.status).toBe(200)

    const responseBody2 = await response2.json()

    expect(Array.isArray(responseBody2)).toBe(true)
    expect(responseBody2.length).toBe(0)
  })
})
