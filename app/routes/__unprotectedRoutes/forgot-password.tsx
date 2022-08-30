import { Form, Link, useActionData, useTransition } from '@remix-run/react'
import type { ActionFunction } from '@remix-run/node'

import AlertBox from '../../components/AlertBox'
import Button from '../../components/Button'
import FormHeader from '../../components/FormHeader'
import Input from '../../components/Input'
import SuccessBox from '../../components/SuccessBox'
import { badRequest, forgotPassword } from '~/models/user.server'
import { validateEmail } from '~/utils/validation'

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()

  const email = form.get('email')

  if (typeof email !== 'string') {
    return badRequest({
      formError: `Form not submitted correctly.`
    })
  }

  const fields = { email }
  const fieldErrors = {
    email: validateEmail(email)
  }

  if (Object.values(fieldErrors).some(Boolean)) return badRequest({ fieldErrors, fields })

  return forgotPassword(email)
}

const ForgotPassword = () => {
  const actionData =  useActionData()
  const { state } = useTransition()

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 m-auto lg:px-8 h-screen font-poppins bg-gray-50">
      <FormHeader>Forgot Password</FormHeader>
      {(actionData?.formError || actionData?.message) && (
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <AlertBox alertMessage={actionData?.formError || actionData?.message} />
        </div>
      )}
      <div className="sm:mx-auto sm:w-full mb-4 mt-4 sm:max-w-md rounded bg-white shadow-md p-9">
        {actionData?.success ? (
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center py-4 pt-1 px-4 sm:px-6">
            <SuccessBox successMessage={actionData?.success || ''} />
          </div>
        ) : (
          <Form method="post">
            <Input label="Email" type="email" name="email" required error={actionData?.fieldErrors?.email} />
            <Button type="submit" label="Submit" loading={state === 'submitting'} message="" />
          </Form>
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

export default ForgotPassword
