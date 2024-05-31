import database from '@/infra/database'
import { beforeAll, it, describe, expect } from 'vitest'

beforeAll(cleanDatabase)

async function cleanDatabase() {
  await database.query({
    text: 'drop schema public cascade; create schema public;'
  })
}

describe('GET /api/v1/migrations', () => {
  it('should return 200', async () => {
    const response = await fetch('http://localhost:3000/api/v1/migrations')
    expect(response.status).toBe(200)

    const responseBody = await response.json()

    expect(Array.isArray(responseBody)).toBe(true)
    expect(responseBody.length).toBeGreaterThan(0)
  })
})
