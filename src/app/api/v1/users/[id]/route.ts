import user from '@/models/user'
import validator from '@/models/validator'
import { userUpdateSchema } from './schemas'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json()

  const parsedBody = userUpdateSchema.safeParse(body)

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

  const userExists = await user.findOneById(params.id)

  if (!userExists) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  const updatedUser = await user.update(params.id, parsedBody.data)

  let serializedUser = validator.omit(updatedUser, ['password'])

  return Response.json(serializedUser, { status: 200 })
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userExists = await user.findOneById(params.id)

  if (!userExists) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  await user.remove(params.id)

  return new Response(null, { status: 204 })
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userExists = await user.findOneById(params.id)

  if (!userExists) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  let serializedUser = validator.omit(userExists, ['password'])

  return Response.json(serializedUser, { status: 200 })
}
