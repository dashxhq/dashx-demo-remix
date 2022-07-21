import Loader from './Loader'
interface ButtonProps  {
  [ key: string ] : any
}

const buttonClass =
  'group relative w-full flex hover:bg-indigo-500 gap-3 justify-center py-2 px-4 border border-transparent text-sm font-medium text-base rounded-md hover:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 mt-2 transition duration-300 text-indigo-500'

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  variant,
  label,
  handleSubmit,
  loading,
  message,
  classes
}) => {
  return (
    <button
      className={`
        ${buttonClass}
        ${variant !== 'outlined' ? 'bg-indigo-600' : 'border-indigo-500'}
        ${classes}
      `}
      type={type}
      onClick={handleSubmit}
      disabled={loading}
    >
      {loading ? (
        <Loader message={message} />
      ) : (
        <p className={`${variant === 'outlined' ? 'hover:text-white' : 'text-white'}`}>{label}</p>
      )}
      {children}
    </button>
  )
}

export default Button
