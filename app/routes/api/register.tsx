import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'

import { register } from '~/utils/session.server'

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return json({ message: 'Method not allowed' }, 405)
  }

  const { firstName, lastName, email, password } = await request.json()

  return register({ firstName, lastName, email, password })
}
