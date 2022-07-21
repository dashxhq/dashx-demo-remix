import { Link, useActionData, useSearchParams } from '@remix-run/react'
import type { ActionFunction } from '@remix-run/node'

import { badRequest, resetPassword } from '~/utils/session.server'
import { validateEmail, validatePassword } from '~/utils/validation'

import FormHeader from '../components/FormHeader'
import AlertBox from '../components/AlertBox'
import SuccessBox from '../components/SuccessBox'
import Input from '../components/Input'
import Button from '../components/Button'

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

  return resetPassword({ email, password })

}

const ResetPassword = () => {
  const actionData = useActionData()
  const successMessage = actionData?.successMessage

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 m-auto">
      <FormHeader>Reset Password</FormHeader>
      <div className="sm:mx-auto sm:w-full mb-4 mt-4 sm:max-w-md rounded bg-white shadow shadow-md p-9">
        {successMessage && (
          <div className="text-center">
            <SuccessBox successMessage={successMessage} />
          </div>
        )}
        {actionData?.formError && (
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
            <AlertBox alertMessage={actionData?.formError} />
          </div>
        )}
        {!successMessage && !actionData?.formError && (
          <form method='post'>
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
            <Button type="submit" label="Submit" />
          </form>
        )}
        <div className="text-sm text-center pt-6">
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
