import { useActionData, Form, Link, useTransition } from '@remix-run/react'
import type { ActionFunction, LoaderFunction} from '@remix-run/node'
import { redirect } from '@remix-run/node'

import Button from '../components/Button'
import Input from '../components/Input'
import AlertBox from '../components/AlertBox'
import FormHeader from '../components/FormHeader'
import { badRequest, register } from '~/models/user.server'
import { getUser } from '~/utils/session.server'
import { validateEmail, validatePassword, validateName } from '~/utils/validation'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  if (user) {
    return redirect('/home')
  }
  
  return null
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()

  const first_name = form.get('first_name')
  const last_name = form.get('last_name')
  const email = form.get('email')
  const password = form.get('password')

  if (
    typeof first_name !== 'string' ||
    typeof last_name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`
    })
  }

  const fields = { first_name, last_name, email, password }
  const fieldErrors = {
    first_name: validateName(first_name, 'First Name'),
    last_name: validateName(last_name, 'Last Name'),
    email: validateEmail(email),
    password: validatePassword(password)
  }

  if (Object.values(fieldErrors).some(Boolean)) return badRequest({ fieldErrors, fields })

  return register({ first_name, last_name, email, password })
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
                  name="first_name"
                  minLength="3"
                  required
                  error={actionData?.fieldErrors?.first_name}
                />
                <Input
                  label="Last Name"
                  type="text"
                  name="last_name"
                  minLength="3"
                  required
                  error={actionData?.fieldErrors?.last_name}
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
