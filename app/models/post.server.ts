import { json } from '@remix-run/server-runtime'
import { db } from '~/utils/db.server'

const getPosts = async () => {

  try {
    const posts = await db.posts.findMany({
      take: 20,
      select:{
        id: true,
        image:true,
        video: true,
        text: true,
        created_at: true,
        users:{
          select:{
            avatar: true,
            first_name: true,
            last_name: true
          }
        },
        bookmarks:{
          select:{
            user_id: true,
            post_id: true,
            bookmarked_at: true
          }
        }
      }
    })

    return posts
  } catch (error) {
    return json({message: error}, 500)
  }
}

export { getPosts }
