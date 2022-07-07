import bcrypt from 'bcrypt'
import { db } from './db.server'

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

export async function register({ firstName, lastName, email, password }: RegisterType) {
  const passwordHash = await bcrypt.hash(password, 10)

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
