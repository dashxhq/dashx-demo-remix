import classNames from 'classnames'

const inputClass =
  'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-600 focus:border-indigo-500 sm:text-sm form-control text-base' 

const Input = (props: any) => {
  const { error, name, label, minLength } = props
  const errorClass = error ? 'border border-red-500' : ''

  return (
    <div className="mb-6">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
         {...props}
         minLength={minLength}
         required
          className={classNames(inputClass, errorClass)}
        />
      </div>

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

export default Input
