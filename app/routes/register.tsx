import { useActionData, Form, Link, useTransition } from '@remix-run/react'
import type { ActionFunction } from '@remix-run/node'

import { validateEmail, validatePassword, validateName } from '~/utils/validation'

import Button from '../components/Button'
import Input from '../components/Input'
import AlertBox from '../components/AlertBox'
import FormHeader from '../components/FormHeader'
import { badRequest, register } from '~/utils/session.server'

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
    firstName: validateName(firstName, 'First Name'),
    lastName: validateName(lastName, 'Last Name'),
    email: validateEmail(email),
    password: validatePassword(password)
  }

  if (Object.values(fieldErrors).some(Boolean)) return badRequest({ fieldErrors, fields })

  return register({ firstName, lastName, email, password })
}

const Register = () => {
  const actionData = useActionData()
  const { state } = useTransition()

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 h-screen font-poppins bg-gray-50">
      <FormHeader>Register for an account</FormHeader>
      {actionData?.formError && (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <AlertBox alertMessage={actionData?.formError} />
        </div>
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-md rounded bg-white shadow shadow-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="py-8 px-4 sm:px-10">
            <Form method="post">
              <fieldset disabled={state === 'submitting'}>
                <Input
                  label="First Name"
                  type="text"
                  name="firstname"
                  minLength="3"
                  required
                  error={actionData?.fieldErrors?.firstName}
                />
                <Input
                  label="Last Name"
                  type="text"
                  name="lastname"
                  minLength="3"
                  required
                  error={actionData?.fieldErrors?.lastName}
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  required
                  error={actionData?.fieldErrors?.email}
                />
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  required
                  error={actionData?.fieldErrors?.password}
                />

                <div className="mt-7">
                  <Button
                    type="submit"
                    label="Register"
                    loading={state === 'submitting'}
                    message="Signing up"
                  />
                  <Link to="/login">
                    <Button label="Login" variant="outlined" loading={false} classes="mt-3" />
                  </Link>
                </div>
              </fieldset>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
