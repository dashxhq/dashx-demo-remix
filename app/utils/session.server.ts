import { createCookieSessionStorage, redirect, Request } from '@remix-run/node'
import { Prisma } from '@prisma/client'
import { json } from '@remix-run/node'
import bcrypt from 'bcrypt'

import type { SessionStorage } from '@remix-run/node'

import dashx from '~/utils/dashx'
import { db } from '~/utils/db.server'

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

type RequestType = {
  firstName?: string
  lastName?: string
  name?: string
  email: string
  password?: string 
  feedback?: string
}

const getUserSession = (request: Request) => storage.getSession(request.headers.get('Cookie'))

export async function register({ firstName, lastName, email, password }: RequestType) {
  if (!firstName || !lastName || !email || !password) {
    return json({ message: 'All fields are required.' }, 422)
  }

  try {
    const passwordHash: string = await bcrypt.hash(password, 10)
    const user = await db.user.create({
      data: { firstName, lastName, email, passwordHash }
    })

    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }

    await dashx.identify(user.id, userData)
    await dashx.track('User Registered', user.id, userData)

    return json({ success: 'User Registered' }, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002' && error.meta?.target == 'email') {
        return json({ message: 'User already registered' }, 409)
      }
    }
    return json({ message: error }, 500)
  }
}

export async function login({ email, password = '' }: RequestType) {
  let existingUser = await db.user.findFirst({ where: { email } })
  if (!existingUser) return null

  const passwordsMatch = await bcrypt.compare(password, existingUser.passwordHash)
  if (!passwordsMatch) return null

  return existingUser
}

export async function resetPassword({ email, password = '' }: RequestType) {
  const passwordHash = await bcrypt.hash(password, 10)
  const existingUser = await db.user.findFirst({ where: { email } })

  if (!existingUser) {
    return json({ message: 'This email does not exist in our records.' }, 404)
  }

  const isPasswordSameAsExistingPassword = await bcrypt.compare(password, existingUser.passwordHash)

  if (isPasswordSameAsExistingPassword) {
    return json({ message: 'Entered password is same a previous password' }, 404)
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

export async function contactUs({ name, email, feedback }: RequestType) {
  if (!name || !email || !feedback) {
    return json({ message: 'All fields are required.' }, 422)
  }

  try {
    await dashx.deliver('email', {
      content: {
        name: 'Contact us',
        from: 'noreply@dashxdemo.com',
        to: [email, 'sales@dashx.com'],
        subject: 'Contact Us Form',
        html_body: `
          <mjml>
            <mj-body>
              <mj-section>
                <mj-column>
                  <mj-divider border-color="#F45E43"></mj-divider>
                  <mj-text>Thanks for reaching out! We will get back to you soon!</mj-text>
                  <mj-text>Your feedback: </mj-text>
                  <mj-text>Name: ${name}</mj-text>
                  <mj-text>Email: ${email}</mj-text>
                  <mj-text>Feedback: ${feedback}</mj-text>
                  <mj-divider border-color="#F45E43"></mj-divider>
                </mj-column>
              </mj-section>
            </mj-body>
          </mjml>`
      }
    })

    return json({
      success: 'Thanks for reaching out! We will get back to you soon.'
    }, 200)
  } catch (error) {
    console.log(error)
    return json({ message: error }, 500)
  }
}