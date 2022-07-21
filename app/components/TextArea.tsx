const TextArea = (props: any) => {
  const { error, name, label, type } = props
  const errorClass = error ? 'border border-red-500' : ''

  return (
    <div className="mt-1 sm:mt-0 sm:col-span-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        rows={5}
        type={type}
        {...props}
        className={`
        max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500
        sm:text-sm border border-gray-300 rounded-md mt-1
        ${errorClass ? 'border border-red-500' : ''}
        `}
      />
      {error ? (
        <p
          className="form-validation-error font-medium text-sm text-red-600 mt-1"
          role="alert"
          id={`${name}-error`}
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default TextArea
