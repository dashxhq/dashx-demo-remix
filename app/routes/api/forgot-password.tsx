import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'

import { forgotPassword } from '~/models/user.server'

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return json({ message: 'Method not allowed' }, 405)
  }

  const { email } = await request.json()

  return forgotPassword(email)
}
