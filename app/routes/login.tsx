import type { ActionFunction } from '@remix-run/node'
import { useActionData, Link } from '@remix-run/react'

import { badRequest, login } from '~/utils/session.server'
import { validateEmail, validatePassword } from '~/utils/validation'

import AlertBox from '../components/AlertBox'
import Button from '../components/Button'
import FormHeader from '../components/FormHeader'
import Input from '../components/Input'

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const email = form.get('email')
  const password = form.get('password')

  if (typeof email !== 'string' || typeof password !== 'string') {
    return badRequest({
      formError: `Form not submitted correctly.`
    })
  }

  const fields = { email, password }
  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password)
  }

  if (Object.values(fieldErrors).some(Boolean)) return badRequest({ fieldErrors, fields })

  let user = await login({ email, password })

  if (!user) {
    return {
      fields,
      formError: `Username/Password combination is incorrect`
    }
  }

  return null
}

const Login = () => {
  const actionData = useActionData()

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <FormHeader>Login to your account</FormHeader>
      {actionData?.formError && (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <AlertBox alertMessage={actionData?.formError} />
        </div>
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-md rounded bg-white shadow-md pt-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="py-8 pt-1 px-4 sm:px-10">
            <form method="post" >
              <Input
                label="Email"
                name="email"
                type="email"
                error={actionData?.fieldErrors?.email}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                error={actionData?.fieldErrors?.password}
              />

              <div className="mt-6 flex items-start justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link
                    to="forgot-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <div className="mt-7">
                <Button type="submit" label="Login" message="Logging in" />

                <Link to="/register">
                  <Button label="Register" variant="outlined" loading={false} classes="mt-3" />
                </Link>
              </div>
            </form>
            <div className="text-sm text-center pt-6">
              <Link to="/contact-us" className="font-medium text-indigo-600 hover:text-indigo-500">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
