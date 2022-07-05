import React, { useState } from 'react'
import { Link, useSearchParams } from "@remix-run/react"

import * as Yup from 'yup'
import { Form, Formik } from 'formik'

import FormHeader from '../components/FormHeader'
import AlertBox from '../components/AlertBox'
import SuccessBox from '../components/SuccessBox'
import Input from '../components/Input'
import Button from '../components/Button'

const ResetPassword = () => {
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [params] = useSearchParams()

  const handleSubmit = () => {

  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 m-auto">
      <FormHeader>Reset Password</FormHeader>
      <div className="sm:mx-auto sm:w-full mb-4 mt-4 sm:max-w-md rounded bg-white shadow shadow-md p-9">
        {successMessage && (
          <div className="text-center">
            <SuccessBox successMessage={successMessage} />
          </div>
        )}
        {error && (
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
            <AlertBox alertMessage={error} />
          </div>
        )}
        {!successMessage && !error && (
          <Formik
            initialValues={{
              password: ''
            }}
            validationSchema={Yup.object({
              password: Yup.string().required('New Password is required')
            })}
            onSubmit={() => {
              handleSubmit()
            }}
          >
            <Form>
              <Input label="New Password" type="password" name="password" />
              <Button type="submit" label="Submit" loading={loading} />
            </Form>
          </Formik>
        )}
        <div className="text-sm text-center pt-6">
          <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
