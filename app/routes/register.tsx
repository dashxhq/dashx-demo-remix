import { useState } from 'react'
import { Link } from "@remix-run/react"

import * as Yup from 'yup'
import { Formik, Form } from 'formik'

import Button from '../components/Button'
import Input from '../components/Input'
import AlertBox from '../components/AlertBox'
import FormHeader from '../components/FormHeader'

const Register = () => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = () => {

  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <FormHeader>Register for an account</FormHeader>
      {error && (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <AlertBox alertMessage={error} />
        </div>
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-md rounded bg-white shadow shadow-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="py-8 px-4 sm:px-10">
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: ''
              }}
              validationSchema={Yup.object({
                firstName: Yup.string().required('First Name is required'),
                lastName: Yup.string().required('Last Name is required'),
                email: Yup.string().email('Invalid email address').required('Email is required'),
                password: Yup.string().required('Password is required')
              })}
              onSubmit={() => {
                handleRegister()
              }}
            >
              <Form>
                <Input label="First Name" type="text" name="firstName" />
                <Input label="Last Name" type="text" name="lastName" />
                <Input label="Email" type="email" name="email" />
                <Input label="Password" type="password" name="password" />

                <div className="mt-7">
                  <Button type="submit" label="Register" loading={loading} message="Signing up" />
                  <Link to="/">
                    <Button label="Login" variant="outlined" loading={false} classes="mt-3" />
                  </Link>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
