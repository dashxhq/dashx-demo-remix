import { Form, Link, useActionData, useTransition } from '@remix-run/react'
import { ActionFunction, json } from '@remix-run/node'

import AlertBox from '../components/AlertBox'
import Button from '../components/Button'
import FormHeader from '../components/FormHeader'
import Input from '../components/Input'
import TextArea from '../components/TextArea'
import SuccessBox from '../components/SuccessBox'
import { validateEmail, validateName } from '~/utils/validation'
import { contactUs } from '~/utils/session.server'

type ActionData = {
  formError?: string
  fieldErrors?: {
    email: string | undefined
    password?: string | undefined
    name?: string | undefined
    feedback?: string | undefined
    firstName?: string | undefined
    lastName?: string | undefined
  }
  fields?: {
    name?: string
    email: string
    password?: string
    firstName?: string
    lastName?: string
    feedback?: string
  }
}

const badRequest = (data: ActionData) => json(data, { status: 400 })

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()

  const name = form.get('name')
  const email = form.get('email')
  const feedback = form.get('feedback')

  if (typeof name !== 'string' || typeof email !== 'string' || typeof feedback !== 'string') {
    return badRequest({
      formError: `Form not submitted correctly.`
    })
  }

  const fields = { name, email, feedback }
  const fieldErrors = {
    name: validateName(name, 'Name'),
    email: validateEmail(email),
    feedback: validateName(feedback, 'Feedback')
  }

  if (Object.values(fieldErrors).some(Boolean)) return badRequest({ fieldErrors, fields })

  return contactUs({ name, email, feedback })
}

const Contact = () => {
  const actionData = useActionData()
  const { state } = useTransition()

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 h-screen font-poppins bg-gray-50">
      <FormHeader>Contact Us</FormHeader>
      {actionData?.formError && (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <AlertBox alertMessage={actionData?.formError} />
        </div>
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-md rounded bg-white shadow shadow-md pt-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md pb-8">
          {actionData?.success ? (
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center py-4 pt-1 px-4 sm:px-6">
              <SuccessBox successMessage={actionData?.success} />
            </div>
          ) : (
            <div className="py-8 pt-1 px-4 sm:px-10">
              <Form method="post">
                <Input label="Name" type="text" name="name" error={actionData?.fieldErrors?.name} />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  error={actionData?.fieldErrors?.email}
                />
                <TextArea
                  label="Send us a message"
                  name="feedback"
                  error={actionData?.fieldErrors?.feedback}
                />

                <div className="mt-7">
                  <Button
                    type="submit"
                    label="Submit"
                    loading={state === 'submitting'}
                    message=""
                  />
                </div>
              </Form>
            </div>
          )}
          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Go back
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
