import { useState } from 'react'
import { useActionData, useLoaderData } from '@remix-run/react'
import type { ActionFunction, LoaderFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'

import AlertBox from '~/components/AlertBox'
import Button from '../../components/Button'
import EmptyPage from '~/components/EmptyPage'
import Loader from '~/components/Loader'
import Modal from '~/components/Modal'
import Post from '~/components/Post'
import { getPosts, toggleBookmark } from '~/models/post.server'
import { getUser } from '~/utils/session.server'
import { createPost } from '~/models/post.server'

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const { user }: any = await getUser(request)
    const posts = await getPosts(user)
    return json(posts, 200)
  } catch (error) {
    console.log(error)
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

    if (formData.get('_method') === 'createPost') {
      const post = {
        text: formData.get('text')
      }

      const newPost = await createPost(user, post)
      return newPost
    }
  } catch (errors) {
    return { errors }
  }
}

const Home = () => {
  const [posts, setPosts] = useState(useLoaderData())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const actionData = useActionData()
  const toggleBookmark = (postId: any) => {
    setPosts((posts) =>
      //@ts-ignore
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              bookmarks: [{ bookmarked_at: !post.bookmarks[0]?.bookmarked_at ? new Date() : null }]
            }
          : post
      )
    )
  }

  return (
    <>
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Posts</h1>
        <div>
          <Button label="Add Post" loading={false} onClick={() => setIsModalOpen(true)} />
        </div>
      </div>
      {actionData?.errors && <AlertBox alertMessage={actionData.errors} />}
      {!posts && <Loader message="Posts being fetched" />}
      {!posts.length && <EmptyPage message="No posts" />}
      {posts.length > 0 && (
        <div className="grid grid-cols-1 gap-3 mt-5">
          {//@ts-ignore
          posts.map((post: any) => (
            <Post post={post} key={post.id} toggleBookmark={toggleBookmark} />
          ))}
        </div>
      )}
      <Modal
        open={isModalOpen}
        setOpen={setIsModalOpen}
      />
    </>
  )
}

export default Home
