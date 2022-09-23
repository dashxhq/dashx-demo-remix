import * as Yup from 'yup'
import { Link, useActionData } from '@remix-run/react'
import type { ActionFunction } from '@remix-run/node'

import AlertBox from '../../components/AlertBox'
import Button from '../../components/Button'
import FormHeader from '../../components/FormHeader'
import Input from '../../components/Input'
import SuccessBox from '../../components/SuccessBox'
import { resetPassword } from '~/models/user.server'
import { validateForm } from '~/utils/validation'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  try {
    const resetPasswordSchema = Yup.object({
      email: Yup.string()
        .email('Email is not valid')
        .required('Email is required')
        .nullable(),
      password: Yup.string().required('Password is required').min(4)
    })

    const resetPasswordData = await validateForm(formData, resetPasswordSchema)
    return resetPassword(resetPasswordData)
  } catch (error) {
    //@ts-ignore
    return { fieldErrors: error?.formError }
  }
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
        {actionData?.message && (
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
            <AlertBox alertMessage={actionData?.message} />
          </div>
        )}
        {!successMessage && !actionData?.message && (
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
