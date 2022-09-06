import jwtDecode from 'jwt-decode'
import { createCookieSessionStorage, redirect } from '@remix-run/node'
import { db } from './db.server'

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('No session secret')
}

// Create session storage
const storage = createCookieSessionStorage({
  cookie: {
    name: 'dashX_demo_remix_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 60,
    httpOnly: true
  }
})

// Create user session
export async function createUserSession(token: string, redirectTo: string) {
  const session = await storage.getSession()
  session.set('token', token)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session)
    }
  })
}

// Get user session
export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'))
}

// Get logged in user
export async function getUser(request: Request) {
  const session = await getUserSession(request)
  try {
    const token = session.get('token')
    const decodedToken = jwtDecode(token) as any
    const user = await db.users.findUnique({ where: { id: decodedToken.user.id } })
    return {user, token: decodedToken.dashx_token}
  } catch (error) {
    return redirect('/login')
  }
}

// Logout user and destroy session pending dashx.reset
export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'))
  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session)
    }
  })
}
