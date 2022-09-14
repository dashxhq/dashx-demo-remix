import * as Yup from 'yup'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

import AlertBox from './AlertBox'
import Button from './Button'
import TextArea from './TextArea'

const Modal = ({ open, setOpen }: any) => {
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)

  const validatePost = async (event: any) => {
    setLoading(true)
    const getValidationErrors = (err: any) => {
      const validationErrors = {} as any
      err.inner.forEach((error: any) => {
        if (error.path) {
          validationErrors[error.path] = error.message
        }
      })

      setErrors(validationErrors)
    }

    const postSchema = Yup.object({
      text: Yup.string().required('Text is a required field').nullable()
    })

    const postData = {
      text: event.target.text.value
    }

    // validate the object and throw error if not valid
    try {
      const post = await postSchema.validate(postData, { abortEarly: false })
      return post
    } catch (error) {
      event.preventDefault()
      setLoading(false)
      throw getValidationErrors(error)
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex flex-col sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-2xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 w-full">
                  <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row items-start">
                    <h2 className="font-medium text-md w-full sm:w-1/4">Create a Post</h2>
                    <form
                      className="w-full sm:w-3/4"
                      method="POST"
                      onSubmit={(event) => validatePost(event)}
                    >
                      <TextArea
                        label="Text"
                        name="text"
                        rows={8}
                        onChange={() => setErrors(null)}
                      />
                      {
                        //@ts-ignore
                        errors?.text && <AlertBox alertMessage={errors.text} />
                      }
                      <div className="py-3 pt-5 flex gap-3 sm:gap-0 sm:flex justify-start items-start flex-row-reverse">
                        <input type="hidden" name="_method" value="createPost" />
                        <Button
                          type="submit"
                          classes="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                          label="Post"
                          loading={loading}
                        />
                        <Button
                          type="button"
                          classes="justify-center rounded-md border border-transparent shadow-sm px-4 py-2 font-medium text-white hover:bg-gray-50 hover:text-gray-800 text-gray-800 bg-transparent border-gray-200 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Modal
