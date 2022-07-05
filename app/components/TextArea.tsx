import { ErrorMessage, useField } from 'formik'

const TextArea = (props: any) => {
  const [field, meta] = useField(props)
  const { name, label } = props
  const errorClass = meta.touched && meta.error ? 'error' : ''

  return (
    <div className="mt-1 sm:mt-0 sm:col-span-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        {...field}
        rows={5}
        className={`
          max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500
          sm:text-sm border border-gray-300 rounded-md mt-1
          ${errorClass ? 'border border-red-500' : ''}
        `}
      />
      <ErrorMessage name={name} component="p" className="font-medium text-sm text-red-600 mt-1" />
    </div>
  )
}

export default TextArea
