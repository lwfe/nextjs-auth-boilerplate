import { describe, expect, it } from 'vitest'

describe('POST /api/v1/session', () => {
  it('should return 201', async () => {
    const response = await fetch('http://localhost:3000/api/v1/session', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@gmail',
        password: '123456'
      })
    })
    expect(response.status).toBe(201)
  })
})
