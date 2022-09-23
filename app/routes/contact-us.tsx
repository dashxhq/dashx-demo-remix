import * as Yup from 'yup'
import { Form, Link, useActionData, useTransition } from '@remix-run/react'
import type { ActionFunction} from '@remix-run/node'

import AlertBox from '~/components/AlertBox'
import Button from '../components/Button'
import FormHeader from '../components/FormHeader'
import Input from '../components/Input'
import SuccessBox from '../components/SuccessBox'
import TextArea from '../components/TextArea'
import { contactUs } from '~/models/user.server'
import { validateForm } from '~/utils/validation'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  try {
    const contactSchema = Yup.object({
      name: Yup.string().required('Name is required').nullable(),
      email: Yup.string()
        .email('Email is not valid')
        .required('Email is required')
        .nullable(),
      feedback: Yup.string().required('Feedback is required').min(10)
    })

    const contactData = await validateForm(formData, contactSchema)
    return contactUs(contactData)
  } catch (error) {
    //@ts-ignore
    return { fieldErrors: error?.formError }
  }
}

const Contact = () => {
  const actionData = useActionData()
  const { state } = useTransition()

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 h-screen font-poppins bg-gray-50">
      <FormHeader>Contact Us</FormHeader>
      {actionData?.message && (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <AlertBox alertMessage={actionData?.message} />
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
                  minLength="3"
                  required
                  error={actionData?.fieldErrors?.email}
                />
                <TextArea
                  label="Send us a message"
                  name="feedback"
                  required
                  minLength="10"
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
