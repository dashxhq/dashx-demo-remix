import { useActionData, useLoaderData } from '@remix-run/react'
import type { ActionFunction, LoaderFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
import { useState } from 'react'

import AlertBox from '~/components/AlertBox'
import EmptyPage from '~/components/EmptyPage'
import Loader from '~/components/Loader'
import Post from '~/components/Post'
import { getBookmarkedPosts, toggleBookmark } from '~/models/post.server'
import { getUser } from '~/utils/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const { user }: any = await getUser(request)
    const bookmarks = await getBookmarkedPosts(user)
    return json(bookmarks, 200)
  } catch (error) {
    return json([], 200)
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const { user }: any = await getUser(request)
  try {
    if (formData.get('_method') === 'bookmark') {
      const postId = formData.get('postId')
      const isBookmarked = formData.get('isBookmarked')
      const bookmark = await toggleBookmark(user, Number(postId), isBookmarked)
      return bookmark
    }
  } catch (errors) {
    return { errors }
  }
}

const Bookmarks = () => {
  const actionData = useActionData()
  const [bookmarks, setBookmarks] = useState(useLoaderData())
  const removeBookmark = (post_id: any) => {
    //@ts-ignore
    setBookmarks(bookmarks?.filter((bookmark: any) => bookmark.post_id !== post_id))
  }
  return (
    <>
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Bookmarks</h1>
      </div>
      {actionData?.errors && <AlertBox alertMessage={actionData.errors} />}
      {!bookmarks && <Loader message="Bookmarks being fetched" />}
      {!bookmarks.length && <EmptyPage message="No Bookmarks" />}
      {bookmarks.length > 0 && (
        <div className="grid grid-cols-1 gap-3 mt-5">
          {
            // @ts-ignore
            bookmarks.map((bookmark: any) => (
              <Post post={bookmark.posts} key={bookmark.posts.id} removeBookmark={removeBookmark} />
            ))
          }
        </div>
      )}
    </>
  )
}

export default Bookmarks
