"use client"

import IconSpinner from "@/icons/spinner.svg"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getTweets } from "../actions/tweets"
import { useMapStore } from "../stores/useMapStore"
import { ITweet } from "../types/ITweet"

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
              return { text: data.tweetText, url: doc.tweetUrl }
            } catch (error) {
              console.error("Error fetching tweet text:", error)
              return { text: "Hata", url: doc.tweetUrl }
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
        <div className="flex h-full !max-h-80 min-h-full flex-col overflow-y-auto lg:h-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-3">
              <IconSpinner className="size-[20px] animate-spin" />
            </div>
          ) : (
            tweets.map((tweet, index) => (
              <div key={index} className="border-b border-spruce last:border-0">
                <div className="tweet-content px-4 py-3">
                  <p dangerouslySetInnerHTML={{ __html: tweet.text ?? "Tweet silindi veya görüntülenemiyor" }} />
                  {tweet.url && (
                    <Link href={tweet.url} target="_blank" className="block py-4">
                      X'de Görüntüle
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Trending