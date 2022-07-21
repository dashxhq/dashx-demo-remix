import { Prisma } from '@prisma/client'
import { json } from '@remix-run/node'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import dashx from '~/utils/dashx'
import { db } from '~/utils/db.server'
import type { ActionData, RequestType } from './interfaces'

const sessionSecret = process.env.JWT_SECRET || ''

const badRequest = (data: ActionData) => json(data, { status: 400 })

const register = async ({ firstName, lastName, email, password }: RequestType) => {
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

const login = async ({ email, password = '' }: RequestType) => {
  let existingUser = await db.user.findFirst({ where: { email } })
  if (!existingUser) return null

  const passwordsMatch = await bcrypt.compare(password, existingUser.passwordHash)
  if (!passwordsMatch) return null

  return existingUser
}

const resetPassword = async ({ email, password = '' }: RequestType) => {
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

const contactUs = async ({ name, email, feedback }: RequestType) => {
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
    const user = await db.user.findUnique({ where: { email } })
    if (!user) {
      return json({ message: 'This email does not exist in our records.' }, 404)
    }

    const token = jwt.sign({ email: user.email }, sessionSecret, {
      expiresIn: '15m'
    })

    await dashx.deliver('email/forgot-password', {
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
