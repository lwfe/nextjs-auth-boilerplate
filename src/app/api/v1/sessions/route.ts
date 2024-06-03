import user from '@/models/user'
import authentication from '@/models/authentication'

export async function POST(request: Request) {
  const body = await request.json()

  let storedUser
  try {
    storedUser = await user.findOneByEmail(body.email)
    await authentication.comparePasswords(body.password, storedUser?.password!)
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 401 })
  }

  const sessionObject = await authentication.createSessionAndSetCookies(
    storedUser?.id!
  )
  return Response.json(
    { ...sessionObject, role: storedUser?.role },
    { status: 201 }
  )
}
