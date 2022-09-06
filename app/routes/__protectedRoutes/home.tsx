// import React, { useState } from 'react'

import Modal from '~/components/Modal'
import Button from '../../components/Button'
// import AlertBox from '../../components/AlertBox'
// import Post from '../components/Post'
import { useLoaderData } from '@remix-run/react'
import type { LoaderFunction} from '@remix-run/server-runtime';
import { json, redirect } from '@remix-run/server-runtime'
import { useState } from 'react'
import AlertBox from '~/components/AlertBox'
import Loader from '~/components/Loader'
// import { useCurrentUserContext } from '~/contexts/CurrentUserContext'
import { getPosts } from '~/models/post.server'
import { getUser } from '~/utils/session.server'
import EmptyPage from '~/components/EmptyPage'
import Post from '~/components/Post'

import dayjs from '~/utils/dayjs'

export const loader:LoaderFunction = async ({request}) => {
  try {
    await getUser(request)
    const posts = await getPosts()
    return json(posts,200)
    
  } catch (error) {
    console.log(error)
    return json([], 200)
  }
}

const Home = () => {
  const posts = useLoaderData()

  const [postsList, setPostsList] = useState(posts)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState('')
  // const [fetchingPosts, setFetchingPosts] = useState(false)
  const [loading, setLoading] = useState(false)

  // const fetchPosts = async () => {
  //   setFetchingPosts(true)
  //   try {
  //     const { data: { posts } = {} } = await api.get('/posts')
  //     setPostsList(posts)
  //   } catch (error) {
  //     setError('Unable to fetch posts.')
  //   }
  //   setFetchingPosts(false)
  // }

  const handleSubmit = async (values: any, resetForm: any) => {
    setError('')
    setLoading(true)

    try {
      // await api.post('/posts', values)
      resetForm()
      // await fetchPosts()
    } catch (error) {
      setError('Unable to create post.')
    }

    setIsModalOpen(false)
    setLoading(false)
  }

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
      setError('Unable to bookmark')
    }
  }

  // useEffect(() => {
  //   fetchPosts()
  // }, [])

  return (
    <>
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Posts</h1>
        <div>
          <Button label="Add Post" loading={false} onClick={() => setIsModalOpen(true)} />
        </div>
      </div>
      {error && <AlertBox alertMessage={error} />}
      {!postsList && <Loader message='Posts being fetched'/>}
      {!postsList.length  && (
        <EmptyPage message="No posts" />
      )}
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
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </>
  )
}

export default Home
