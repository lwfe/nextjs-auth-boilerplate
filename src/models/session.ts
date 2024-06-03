import crypto from 'crypto'

import database from '@/infra/database'
import { cookies } from 'next/headers'

interface ISession {
  id: string
  token: string
  user_id: string
  expires_at: Date
  created_at: Date
  updated_at: Date
}

const SESSION_EXPIRATION_IN_SECONDS = 60 * 60 * 24 * 30 // 30 days

async function create(userId: string): Promise<ISession> {
  const token = crypto.randomBytes(48).toString('hex')
  const expiresAt = new Date(Date.now() + 1000 * SESSION_EXPIRATION_IN_SECONDS)

  const query = {
    text: `INSERT INTO "SESSIONS" (token, user_id, expires_at) VALUES ($1, $2, $3) RETURNING *`,
    values: [token, userId, expiresAt]
  }

  const results = await database.query(query)
  return results?.rows[0]
}

async function findOneByToken(token: string) {
  const query = {
    text: `SELECT * FROM "SESSIONS" WHERE token = $1`,
    values: [token]
  }
  const results = await database.query(query)
  return results?.rows[0]
}

async function findOneById(id: string): Promise<ISession> {
  const query = {
    text: `SELECT * FROM "SESSIONS" WHERE id = $1`,
    values: [id]
  }
  const results = await database.query(query)
  return results?.rows[0]
}

function setSessionIdCookieInResponse(sessionToken: string) {
  cookies().set({
    name: 'sessionId',
    value: sessionToken,
    maxAge: SESSION_EXPIRATION_IN_SECONDS,
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })
}

function clearSessionIdCookie() {
  cookies().set({
    name: 'sessionId',
    value: '',
    maxAge: 0,
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })
}

async function deleteOneByToken(token: string) {
  const query = {
    text: `DELETE FROM "SESSIONS" WHERE token = $1`,
    values: [token]
  }
  await database.query(query)
}

export default Object.freeze({
  create,
  findOneByToken,
  setSessionIdCookieInResponse,
  deleteOneByToken,
  clearSessionIdCookie,
  findOneById
})
