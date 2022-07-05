import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { Form, Formik } from 'formik'
import * as Yup from 'yup'

import Button from '../components/Button'
import Input from '../components/Input'
import AlertBox from '../components/AlertBox'
import SuccessBox from '../components/SuccessBox'
import FormHeader from '../components/FormHeader'

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 m-auto">
      <FormHeader>Forgot Password</FormHeader>
      {error && (
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <AlertBox alertMessage={error} />
        </div>
      )}
      <div className="sm:mx-auto sm:w-full mb-4 mt-4 sm:max-w-md rounded bg-white shadow shadow-md p-9">
        {successMessage && (
          <div className="text-center">
            <SuccessBox successMessage={successMessage} />
          </div>
        )}
        {!successMessage && (
          <Formik
            initialValues={{
              email: ''
            }}
            validationSchema={Yup.object({
              email: Yup.string().email('Invalid email address').required('Email is required')
            })}
            onSubmit={() => {
              handleSubmit()
            }}
          >
            <Form>
              <Input label="Email" type="email" name="email" />
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

export default ForgotPassword
