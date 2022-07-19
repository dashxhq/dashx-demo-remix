import { Prisma } from '@prisma/client'
import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'

import dashx from '~/utils/dashx'
import { register } from '~/utils/session.server'

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return json({ message: 'Method not allowed' }, 405)
  }

  const payload = await request.json()
  const { firstName, lastName, email, password } = payload

  if (!firstName || !lastName || !email || !password) {
    return json({ message: 'All fields are required.' }, 422)
  }

  try {
    const user = await register({ firstName, lastName, email, password })
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }

    await dashx.identify(user.id, userData)
    await dashx.track('User Registered', user.id, userData)

    return json({ message: 'User Registered' }, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002' && error.meta?.target == 'email') {
        return json({ message: 'User already registered' }, 409)
      }
    }
    return json({ message: error }, 500)
  }
}
