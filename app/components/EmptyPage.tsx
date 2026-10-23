import React from 'react'
import { InformationCircleIcon } from '@heroicons/react/outline'

const EmptyPage = ({ message }: any) => (
  <>
    <div className="text-center">
      <InformationCircleIcon className="w-12 h-12 m-auto text-gray-600" />
      <h3 className="mt-2 text-md font-medium text-gray-900">{message}</h3>
      <p className="mt-1 text-md text-gray-500">Nothing to see here.</p>
    </div>
  </>
)

export default EmptyPage
