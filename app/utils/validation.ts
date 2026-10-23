const validateForm = async (formData: FormData, formSchema: any) => {
  const getValidationErrors = (err: any) => {
    const validationErrors = {} as any

    err.inner.forEach((error: any) => {
      if (error.path) {
        validationErrors[error.path] = error.message
      }
    })

    return { formError: validationErrors }
  }

  const formJSON: { [key: string]: any } = {}
  for (var key of formData.keys()) {
    formJSON[key] = formData.get(key)
  }

  // validate the object and throw error if not valid
  try {
    const contactData = await formSchema.validate(formJSON, { abortEarly: false })
    return contactData
  } catch (error) {
    throw getValidationErrors(error)
  }
}

export { validateForm } 
