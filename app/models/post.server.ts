import { json } from '@remix-run/server-runtime'

import { db } from '~/utils/db.server'

const getPosts = async (user: any) => {
  try {
    const posts = await db.posts.findMany({
      select: {
        id: true,
        image: true,
        video: true,
        text: true,
        created_at: true,
        users: {
          select: {
            avatar: true,
            first_name: true,
            last_name: true
          }
        },
        bookmarks: {
          select: {
            bookmarked_at: true
          },
          where: {
            user_id: user.id
          }
        }
      },
      orderBy: {id: 'desc'}
    })

    return posts
  } catch (error) {
    return json({ message: error }, 500)
  }
}

const createPost = async (user: any, post: any) => {
  try {
    const newPost = await db.posts.create({
      data: {
        user_id: user.id,
        text: post.text,
        image: post?.image,
        video: post?.video      }
    })

    return newPost
  } catch (error) {
    return json({ message: error }, 500)
  }
}

export { getPosts, createPost }
