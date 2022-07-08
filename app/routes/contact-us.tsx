import { Link } from "@remix-run/react"

import AlertBox from '../components/AlertBox'
import Button from '../components/Button'
import FormHeader from '../components/FormHeader'
import Input from '../components/Input'
import TextArea from '../components/TextArea'
import SuccessBox from '../components/SuccessBox'

const Contact = () => {
  let error, successMessage
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <FormHeader>Contact Us</FormHeader>
      {error && (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <AlertBox alertMessage={error} />
        </div>
      )}
      <div className="sm:mx-auto sm:w-full sm:max-w-md rounded bg-white shadow shadow-md pt-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md pb-8">
          {successMessage && (
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center py-4 pt-1 px-4 sm:px-6">
              <SuccessBox successMessage={successMessage} />
            </div>
          )}
          {!successMessage && (
            <div className="py-8 pt-1 px-4 sm:px-10">
                <form>
                  <Input label="Name" type="text" name="name" />
                  <Input label="Email" type="email" name="email" />
                  <TextArea label="Send us a message" name="feedback" />

                  <div className="mt-7">
                    <Button type="submit" label="Submit" />
                  </div>
                </form>
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
