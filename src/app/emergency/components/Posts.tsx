"use client"

import { getPosts } from "@/actions/posts"
import IconSpinner from "@/icons/spinner.svg"
import { IPost } from "@/types/IPost"
import { formatDate } from "@/utils/utils"
import { useEffect, useState } from "react"

const Posts = () => {
  const [ posts, setPosts ] = useState<IPost[]>([])
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const postsData = await getPosts()
        setPosts(postsData)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="w-full max-w-96 pb-2 lg:pb-6">
      {isLoading
        ? (
          <div className="flex items-center justify-center py-4">
            <IconSpinner className="size-[26px] animate-spin" />
          </div>
        )
        : (
          <div className="flex flex-col">
            {posts.map((post) => (
              <div key={post.id} className="border-b border-spruce px-2 py-4 last:border-0 lg:px-0">
                <div className="text-[15px] text-gray">
                  <span className="font-medium text-haze">{post.username}</span> · <span>{formatDate(post.timestamp)}</span>
                </div>
                <p className="break-words text-haze">{post.message}</p>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}

export default Posts