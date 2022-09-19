import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { json, redirect } from '@remix-run/node'
import { Prisma } from '@prisma/client'

import dx from '~/utils/dashx.server'
import { db } from '~/utils/db.server'
import type { ActionData, RequestType } from '../utils/interfaces'

const jwtSecret = process.env.JWT_SECRET || ''

const badRequest = (data: ActionData) => json(data, { status: 400 })

const register = async ({ first_name, last_name, email, password }: RequestType) => {
  if (!first_name || !last_name || !email || !password) {
    return json({ message: 'All fields are required.' }, 422)
  }

  try {
    const encrypted_password: string = await bcrypt.hash(password, 10)
    const user = await db.users.create({
      data: { first_name, last_name, email, encrypted_password }
    })

    const userData = {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email
    }

    await dx.identify(user.id, userData)
    await dx.track('User Registered', user.id, userData)

    return redirect('/login')
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002' && error.meta?.target == 'email') {
        return json({ formError: 'User already registered' }, 409)
      }
    }
    return json({ message: error }, 500)
  }
}

const login = async ({ email, password = '' }: RequestType) => {
  let user = await db.users.findUnique({ where: { email } })
  if (!user) return null

  const passwordsMatch = await bcrypt.compare(password, user.encrypted_password as string)
  if (!passwordsMatch) return null

  const token = jwt.sign(
    {
      user,
      dashx_token: dx.generateIdentityToken(user.id)
    },
    jwtSecret,
    {
      expiresIn: 86400 * 30
    }
  )

  return token
}

const resetPassword = async ({ email, password = '' }: RequestType) => {
  const encrypted_password = await bcrypt.hash(password, 10)
  const existingUser = await db.users.findFirst({ where: { email } })

  if (!existingUser) {
    return json({ message: 'This email does not exist in our records.' }, 404)
  }

  const isPasswordSameAsExistingPassword = await bcrypt.compare(
    password,
    existingUser.encrypted_password as string
  )

  if (isPasswordSameAsExistingPassword) {
    return json({ message: 'Entered password is same a previous password' }, 404)
  }

  await db.users.update({ where: { email }, data: { encrypted_password } })

  return null
}

const contactUs = async ({ name, email, feedback }: RequestType) => {
  if (!name || !email || !feedback) {
    return json({ message: 'All fields are required.' }, 422)
  }

  try {
    await dx.deliver('email', {
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

    return json({ success: 'Thanks for reaching out! We will get back to you soon.' }, 200)
  } catch (error) {
    console.log(error)
    return json({ message: error }, 500)
  }
}

const forgotPassword = async (email: string) => {
  if (!email) {
    return json({ message: 'Email is required.' }, 400)
  }

  try {
    const user = await db.users.findUnique({ where: { email } })
    if (!user) {
      return json({ message: 'This email does not exist in our records.' }, 404)
    }

    const token = jwt.sign({ email: user.email }, jwtSecret, {
      expiresIn: '15m'
    })

    await dx.deliver('email/forgot-password', {
      to: user.email,
      data: { token }
    })

    return json({ success: 'Check your inbox for a link to reset your password.' }, 200)
  } catch (error) {
    console.log(error)
    return json({ message: error }, 500)
  }
}

export { badRequest, contactUs, forgotPassword, login, register, resetPassword }
