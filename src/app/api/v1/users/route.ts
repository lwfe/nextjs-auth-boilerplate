import { userCreateSchema } from './schemas'
import { type NextRequest } from 'next/server'

import password from '@/models/password'
import validator from '@/models/validator'
import user, { IUserCreateDTO } from '@/models/user'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as IUserCreateDTO

    const parsedBody = userCreateSchema.safeParse(body)

    if (!parsedBody.success) {
      return Response.json(
        {
          errors: parsedBody.error.errors.map(err => ({
            [err.path[0]]: err.message
          }))
        },
        { status: 400 }
      )
    }

    const userExists = await user.findOneByEmail(body.email)

    if (userExists) {
      return Response.json(
        { error: 'Esse email já está sendo usado por outro usuário' },
        { status: 409 }
      )
    }

    const passwordInput = body.password
    const hashedPassword = await password.hash(passwordInput)

    const createdUser = await user.create({
      ...body,
      password: hashedPassword
    })

    let serializedUser = validator.omit(createdUser, ['password'])
    return Response.json(serializedUser, { status: 201 })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams
  const page = q.get('page') ? Number(q?.get('page')) : 1
  const limit = q.get('limit') ? Number(q?.get('limit')) : 10

  const name = q.get('name') ?? undefined
  const email = q.get('email') ?? undefined
  const role = q.get('role')?.split(',') ?? undefined
  const query = q.get('query') ?? undefined

  const data = await user.filterUsers(page, limit, { name, email, role, query })

  return Response.json(data, { status: 200 })
}
