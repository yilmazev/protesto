"use client"

import { getTweets } from "@/actions/tweets"
import IconSpinner from "@/icons/spinner.svg"
import { useMapStore } from "@/stores/useMapStore"
import { ITweet } from "@/types/ITweet"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const Trending = () => {
  const { selectedCity } = useMapStore()
  const [ isVisible, setIsVisible ] = useState(true)
  const [ isLoading, setIsLoading ] = useState(true)
  const [ tweets, setTweets ] = useState<ITweet[]>([])

  useEffect(() => {
    const fetchTweets = async () => {
      setIsLoading(true)

      try {
        const response = await getTweets()

        const tweetData = await Promise.all(
          response.map(async (doc: any) => {
            try {
              const fetchResponse = await fetch(`/api/fetchTweet?url=${encodeURIComponent(doc.tweetUrl)}`)
              const data = await fetchResponse.json()
              return {
                text: data.tweetText,
                url: data.tweetUrl,
                author: data.author,
                username: data.username,
                image: data.image
              }
            } catch (error) {
              console.error("Error fetching tweet text:", error)
              return {
                text: null,
                url: null,
                author: null,
                username: null,
                image: null
              }
            }
          })
        )

        setTweets(tweetData)
      } catch (error) {
        console.error("Failed to fetch tweet URLs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTweets()
  }, [])

  if (!isVisible || selectedCity) return null

  return (
    <div className="flex w-full flex-col rounded-2xl border border-spruce lg:min-w-96 lg:max-w-96">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-extrabold">Gündem</h1>
      </div>
      <div className="h-full flex-1 overflow-hidden">
        <div className="flex h-full !max-h-96 min-h-full flex-col overflow-y-auto lg:h-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-3">
              <IconSpinner className="size-[20px] animate-spin" />
            </div>
          ) : (
            tweets.map((tweet, index) => {
              if (!tweet.url) return (
                <div key={index} className="tweet-content border-b border-spruce px-4 py-3 transition-all duration-200 last:border-0 hover:bg-[#ffffff08]">
                  <p>Tweet silindi veya görüntülenemiyor</p>
                </div>
              )

              return (
                <Link key={index} href={tweet.url} target="_blank" title={tweet.text} className="tweet-content border-b border-spruce px-4 py-3 transition-all duration-200 last:border-0 hover:bg-[#ffffff08]">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <p className="font-bold">{tweet.author}</p>
                      <p className="ml-1 text-gray">@{tweet.username}</p>
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: tweet.text }} />
                    {tweet.image && (
                      <div className="relative mt-3 h-48 w-full overflow-hidden rounded-2xl">
                        <Image src={tweet.image} alt={tweet.text} fill className="object-cover" />
                      </div>
                    )}
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default Trending