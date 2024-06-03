import session from '@/models/session'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  const foundSession = await session.findOneById(id)

  if (!foundSession) {
    return Response.json({ error: 'Sessão não encontrada' }, { status: 404 })
  }

  await session.deleteOneByToken(foundSession.token)
  session.clearSessionIdCookie()
  return new Response(null, { status: 204 })
}
