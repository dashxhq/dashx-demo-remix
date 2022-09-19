import classNames from 'classnames'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { NavLink, Link } from "@remix-run/react"
import { useNavigate } from 'react-router-dom'
import {
  HomeIcon,
  XIcon,
  BookmarkIcon,
  CurrencyDollarIcon,
  DatabaseIcon
} from '@heroicons/react/outline'

import DashXLogoWhite from '../../public/dashx_logo_white.png'

const navigation = [
  { name: 'Home', href: '/home', icon: HomeIcon },
  { name: 'Store', href: '/store', icon: DatabaseIcon },
  { name: 'Bookmarks', href: '/bookmarks', icon: BookmarkIcon },
  { name: 'Billing', href: '/billing', icon: CurrencyDollarIcon }
]

const Sidebar = ({ setSidebarOpen, sidebarOpen }: any) => {
  const navigate = useNavigate()

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div
                  onClick={() => {
                    navigate('/')
                    setSidebarOpen(false)
                  }}
                >
                  <div className="flex px-4 gap-6 items-center cursor-pointer">
                    <img src={DashXLogoWhite} alt="DashX Logo White" width="30px" height="30px" />
                    <span className="text-xl text-white font-bold">Demo App</span>
                  </div>
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2 space-y-1">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                          classNames(
                            isActive
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'group items-center flex px-2 rounded-md text-base font-medium py-2'
                          )
                        }
                        onClick={() => {
                          setSidebarOpen(!sidebarOpen)
                        }}
                      >
                        <item.icon
                          className={classNames(
                            'text-gray-400 group-hover:text-gray-300',
                            'mr-3 flex-shrink-0 h-6 w-6'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
          <Link
            to="/"
            className="flex gap-6 items-center cursor-pointer h-16 flex-shrink-0 px-4 bg-gray-900"
          >
            <img src={DashXLogoWhite} alt="DashX Logo White" width="30px" height="30px" />
            <span className="text-xl text-white font-bold">Demo App</span>
          </Link>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'flex px-2 rounded-md text-base font-medium py-2'
                    )
                  }
                >
                  <item.icon
                    className={classNames(
                      'text-gray-400 group-hover:text-gray-300',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
