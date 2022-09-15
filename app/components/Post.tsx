import { BookmarkIcon } from '@heroicons/react/outline'
import { useFetcher } from '@remix-run/react'

import dayjs from '~/utils/dayjs'

const Post = ({ post }: any) => {
  const {
    created_at,
    bookmarks: [bookmark],
    text,
    users
  } = post

  const { first_name, last_name } = users
  const published = dayjs(created_at).fromNow()
  const fetcher = useFetcher()

  return (
    <div className="relative flex gap-4 mb-4 bg-gray-50 rounded shadow-md p-4 overflow-hidden">
      <img
        className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt="User Avatar"
      />
      <div className="min-w-0 flex-1">
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium">
            {first_name}&nbsp;{last_name}
          </p>
          <button onClick={() => {
            fetcher.submit({ postId: post.id, isBookmarked: bookmark?.bookmarked_at, _method: 'bookmark' }, { method: "post" })
            bookmark.bookmarked_at= bookmark.bookmarked_at? null : new Date()
          }}>
            {bookmark?.bookmarked_at ? (
              <BookmarkIcon className="cursor-pointer text-gray-600 h-6 w-6 fill-gray-600" />
            ) : (
              <BookmarkIcon className="cursor-pointer text-gray-600 h-6 w-6" />
            )}
          </button>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">Posted {published}</p>
        <div className="mt-2 text-sm text-gray-700">
          <p className="text-justify text-ellipsis overflow-hidden truncate line-clamp-3">{text}</p>
        </div>
      </div>
    </div>
  )
}

export default Post
