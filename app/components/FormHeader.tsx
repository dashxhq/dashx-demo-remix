import DashXLogo from 'public/dashx_logo.svg'

const FormHeader = ({ children } : { children: any }) => (
  <div className="sm:mx-auto sm:w-full sm:max-w-md">
    <div className="flex justify-center items-center">
      <img src={DashXLogo} className="h-12 w-12" alt="DashX Logo" />
    </div>
    <h2 className="mt-6 mb-6 text-center text-3xl font-extrabold text-gray-900">{children}</h2>
  </div>
)

export default FormHeader
