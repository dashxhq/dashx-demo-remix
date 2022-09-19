import * as Yup from 'yup'
import { useActionData, Form, Link, useTransition } from '@remix-run/react'
import type { ActionFunction } from '@remix-run/node'

import Button from '../../components/Button'
import Input from '../../components/Input'
import AlertBox from '../../components/AlertBox'
import FormHeader from '../../components/FormHeader'
import { register } from '~/models/user.server'
import { validateForm } from '~/utils/validation'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  try {
    const registerSchema = Yup.object({
      first_name: Yup.string().required('First name is required').min(3),
      last_name: Yup.string().required('Last name is required').min(1),
      email: Yup.string()
        .email('Email is not valid')
        .required('Email is required')
        .nullable(),
      password: Yup.string().required('Password is required').min(4)
    })

    const registerData = await validateForm(formData, registerSchema)
    return register(registerData)
  } catch (error) {
    //@ts-ignore
    return { fieldErrors: error?.formError }
  }
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
                  minLength="1"
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
