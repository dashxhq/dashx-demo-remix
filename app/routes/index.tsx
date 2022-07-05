import { useState } from 'react'
import { Link } from "@remix-run/react"

import * as Yup from 'yup'
import { Form, Formik } from 'formik'

import AlertBox from '../components/AlertBox'
import Button from '../components/Button'
import FormHeader from '../components/FormHeader'
import Input from '../components/Input'

const Login = () => {
   const [error, setError] = useState('')
   const [loading, setLoading] = useState(false)

   const handleLogin = () => {

  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <FormHeader>Login to your account</FormHeader>
      {error && (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <AlertBox alertMessage={error} />
        </div>
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-md rounded bg-white shadow shadow-md pt-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="py-8 pt-1 px-4 sm:px-10">
            <Formik
              initialValues={{
                email: '',
                password: ''
              }}
              validationSchema={Yup.object({
                email: Yup.string().email('Invalid email address').required('Email is required'),
                password: Yup.string().required('Password is required')
              })}
              onSubmit={ () => {
                handleLogin()
              }}
            >
              <Form>
                <Input label="Email" type="email" name="email" />
                <Input label="Password" type="password" name="password" />

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
                      to="forgot-password"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <div className="mt-7">
                  <Button type="submit" label="Login" loading={loading} message="Logging in" />
                  <Link to="register">
                    <Button label="Register" variant="outlined" loading={false} classes="mt-3" />
                  </Link>
                </div>
              </Form>
            </Formik>
            <div className="text-sm text-center pt-6">
              <Link to="contact-us" className="font-medium text-indigo-600 hover:text-indigo-500">
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
