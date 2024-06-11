import session from '@/models/session'
import password from '@/models/password'

async function createSessionAndSetCookies(userId: string) {
  const sessionObject = await session.create(userId)
  session.setSessionIdCookieInResponse(sessionObject.id)
  session.setUserIdCookieInResponse(userId)
  return sessionObject
}

async function comparePasswords(
  providedPassword: string,
  passwordHash: string
) {
  const isMatch = await password.compare(providedPassword, passwordHash)

  if (!isMatch) {
    throw new Error('Credenciais Inválidas')
  }
}

export default Object.freeze({
  createSessionAndSetCookies,
  comparePasswords
})
