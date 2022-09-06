import { Outlet } from 'react-router-dom'

const Content = () => {
  return (
    <div className="md:pl-64 flex flex-col h-full h-screen font-poppins bg-gray-50 overflow-y-auto">
      <main className="flex-1 h-screen">
        <div className="py-6">
          <div className="max-w-8xl px-4 sm:px-6 md:px-8 pb-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Content
