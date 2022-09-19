import * as Yup from 'yup'
import { useActionData, Link, useTransition } from '@remix-run/react'
import type { ActionFunction } from '@remix-run/node'

import { login } from '~/models/user.server'
import { validateForm } from '~/utils/validation'

import AlertBox from '~/components/AlertBox'
import Button from '~/components/Button'
import FormHeader from '~/components/FormHeader'
import Input from '~/components/Input'
import { createUserSession } from '~/utils/session.server'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  try {
    const loginSchema = Yup.object({
      email: Yup.string()
        .email('Email is not valid')
        .required('Email is required')
        .nullable(),
      password: Yup.string().required('Password is required').min(4)
    })

    const loginData = await validateForm(formData, loginSchema)
    let token = await login(loginData)
    if (!token) {
      return {
        formError: `Incorrect email or password.`
      }
    }

    return createUserSession(token, '/home')
  } catch (error) {
    //@ts-ignore
    return { fieldErrors: error?.formError }
  }
}

const Login = () => {
  const actionData = useActionData()
  const { state } = useTransition()

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
                    to="/forgot-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <div className="mt-7">
                <Button type="submit" label="Login" loading={state === 'submitting'} message="Logging in" />
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
