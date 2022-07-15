import { createCookieSessionStorage, redirect } from '@remix-run/node'
import type { SessionStorage } from '@remix-run/node'

import bcrypt from 'bcrypt'
import { db } from './db.server'

const sessionSecret = process.env.SESSION_SECRET || ''

const storage: SessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'Dashx_demo',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  }
})

type RegisterType = {
  firstName: string
  lastName: string
  email: string
  password: string
}
type LoginType = {
  email: string
  password: string
}

const getUserSession = (request: Request) => storage.getSession(request.headers.get('Cookie'))

export async function register({ firstName, lastName, email, password }: RegisterType) {
  const passwordHash: string = await bcrypt.hash(password, 10)

  const user = await db.user.create({
    data: { firstName, lastName, email, passwordHash }
  })

  return user
}

export async function login({ email, password }: LoginType) {
  let existingUser = await db.user.findFirst({ where: { email } })
  if (!existingUser) return null

  const passwordsMatch = await bcrypt.compare(password, existingUser.passwordHash)
  if (!passwordsMatch) return null

  return existingUser
}

export async function resetPassword({ email, password }: LoginType) {
  let error
  const passwordHash = await bcrypt.hash(password, 10)
  const existingUser = await db.user.findFirst({ where: { email } })

  if (!existingUser) {
    error = 'User not found'
    return error
  }

  const isPasswordSameAsExistingPassword = await bcrypt.compare(password, existingUser.passwordHash)

  if (isPasswordSameAsExistingPassword) {
    error = 'Entered password is same a previous password'
    return error
  }

  await db.user.update({ where: { email }, data: { passwordHash } })

  return null
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession()

  if (!sessionSecret) {
    throw new Error('Must enviornment variable SESSION_SECRET')
  }

  session.set('userId', userId)

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session)
    }
  })
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get('userId')

  if (typeof userId !== 'string') return null
  return userId
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request)

  if (!userId) {
    const params = new URLSearchParams([['redirectTo', redirectTo]])

    throw redirect(`/login?${params}`)
  }

  return userId
}

export async function getUser(request: Request) {
  const userId = await getUserId(request)

  if (!userId) return null

  return db.user.findUnique({ where: { id: userId } })
}

export async function logout(request: Request) {
  const session = await getUserSession(request)
  
  return redirect(`/home`, {
    headers: {
      'Set-Cookie': await storage.destroySession(session)
    }
  })
}
