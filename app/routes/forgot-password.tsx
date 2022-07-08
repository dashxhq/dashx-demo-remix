import { Link } from "@remix-run/react"

import Button from '../components/Button'
import Input from '../components/Input'
import AlertBox from '../components/AlertBox'
import SuccessBox from '../components/SuccessBox'
import FormHeader from '../components/FormHeader'

const ForgotPassword = () => {
let error, successMessage

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 m-auto">
      <FormHeader>Forgot Password</FormHeader>
      {error && (
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <AlertBox alertMessage={error} />
        </div>
      )}
      <div className="sm:mx-auto sm:w-full mb-4 mt-4 sm:max-w-md rounded bg-white shadow-md p-9">
        {successMessage && (
          <div className="text-center">
            <SuccessBox successMessage={successMessage} />
          </div>
        )}
        {!successMessage && (
            <form>
              <Input label="Email" type="email" name="email" />
              <Button type="submit" label="Submit"  />
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

export default ForgotPassword
