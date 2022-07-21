import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'

import { contactUs } from '~/utils/session.server'

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return json({ message: 'Method not allowed' }, 405)
  }

  const { name, email, feedback } = await request.json()

  return contactUs({ name, email, feedback })
}
