import { useState } from 'react'
import { useActionData, useLoaderData } from '@remix-run/react'
import type { ActionFunction, LoaderFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'

import AlertBox from '~/components/AlertBox'
import Button from '../../components/Button'
import dayjs from '~/utils/dayjs'
import EmptyPage from '~/components/EmptyPage'
import Loader from '~/components/Loader'
import Modal from '~/components/Modal'
import Post from '~/components/Post'
import { getPosts } from '~/models/post.server'
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
  if (formData.get('_method') === 'createPost') {
    try {
      const post = {
        text: formData.get('text')
      }

      const { user }: any = await getUser(request)
      const newPost = await createPost(user, post)
      return newPost
    } catch (errors) {
      return { errors }
    }
  }
}

const Home = () => {
  const posts = useLoaderData()
  const [postsList, setPostsList] = useState(posts)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const actionData = useActionData()

  const toggleBookmark = async (postId: any) => {
    try {
      setPostsList((postsList: any) =>
        postsList.map((post: any) =>
          post.id === postId
            ? { ...post, bookmarked_at: !post.bookmarked_at ? dayjs().toISOString() : null }
            : post
        )
      )
      // await api.put(`/posts/${postId}/toggle-bookmark`)
    } catch (error) {
      // setError('Unable to bookmark')
    }
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
      {!postsList && <Loader message="Posts being fetched" />}
      {!postsList.length && <EmptyPage message="No posts" />}
      {postsList.length > 0 && (
        <div className="grid grid-cols-1 gap-3 mt-5">
          {postsList.map((post: any) => (
            <Post post={post} key={post.id} toggleBookmark={() => toggleBookmark(post.id)} />
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
