import { useActionData, Link, useTransition } from '@remix-run/react'
import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'

import { validateEmail, validatePassword, validateName } from '~/utils/validation'
import { register } from '~/utils/session.server'
import { db } from '~/utils/db.server'

import Button from '../components/Button'
import Input from '../components/Input'
import AlertBox from '../components/AlertBox'
import FormHeader from '../components/FormHeader'

type ActionData = {
  formError?: string
  fieldErrors?: {
    email: string | undefined
    password: string | undefined
    firstName: string | undefined
    lastName: string | undefined
  }
  fields?: {
    email: string
    password: string
    firstName: string
    lastName: string
  }
}

const badRequest = (data: ActionData) => json(data, { status: 400 })

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()

  const firstName = form.get('firstname')
  const lastName = form.get('lastname')
  const email = form.get('email')
  const password = form.get('password')

  if (
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`
    })
  }

  const fields = { firstName, lastName, email, password }
  const fieldErrors = {
    firstName: validateName(firstName, 'firstName'),
    lastName: validateName(lastName, 'lastName'),
    email: validateEmail(email),
    password: validatePassword(password)
  }

  if (Object.values(fieldErrors).some(Boolean)) return badRequest({ fieldErrors, fields })

  const existingUser = await db.user.findFirst({ where: { email } })

  if (existingUser) {
    return {
      fields,
      formError: `User with email ${email} already exists`
    }
  }

  const user = await register({ firstName, lastName, email, password })

  if (!user) {
    return {
      fields,
      formError: `Something went wrong trying to create a new user.`
    }
  }

  return 'Registration successfull'
}

const Register = () => {
  const actionData = useActionData()

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <FormHeader>Register for an account</FormHeader>
      {actionData?.formError && (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <AlertBox alertMessage={actionData?.formError} />
        </div>
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-md rounded bg-white shadow-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="py-8 px-4 sm:px-10">
            <form method="post">
              <Input
                label="First Name"
                type="text"
                name="firstname"
                error={actionData?.fieldErrors?.firstName}
              />
              <Input
                label="Last Name"
                type="text"
                name="lastname"
                error={actionData?.fieldErrors?.lastName}
              />
              <Input
                label="Email"
                type="email"
                name="email"
                error={actionData?.fieldErrors?.email}
              />
              <Input
                label="Password"
                type="password"
                name="password"
                error={actionData?.fieldErrors?.password}
              />

              <div className="mt-7">
                <Button type="submit" label="Register" message="Signing up" />
                <Link to="/login">
                  <Button label="Login" variant="outlined" loading={false} classes="mt-3" />
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
