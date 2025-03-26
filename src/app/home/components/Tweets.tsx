"use client"

import IconSpinner from "@/icons/spinner.svg"
import IconTimes from "@/icons/times.svg"
import { useMapStore } from "@/stores/useMapStore"
import { ITweet } from "@/types/ITweet"
import { useEffect, useState } from "react"

import NotFound from "./tweets/NotFound"
import Post from "./tweets/Post"

const Tweets = () => {
  const { selectedCity, setSelectedCity } = useMapStore()
  const [ tweets, setTweets ] = useState<ITweet[]>([])
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    if (!selectedCity?.tweetUrls?.length) return

    const fetchTweets = async () => {
      setIsLoading(true)

      try {
        const tweetData = await Promise.all(
          selectedCity.tweetUrls.map(async (url) => {
            const response = await fetch(`/api/fetchTweet?url=${encodeURIComponent(url)}`)
            if (response.ok) {
              const data = await response.json()
              return {
                text: data.tweetText,
                url: data.tweetUrl,
                author: data.author,
                username: data.username,
                image: data.image
              }
            } else {
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
        console.error("Tweet data fetch failed:", error)
        return {
          text: null,
          url: null,
          author: null,
          username: null,
          image: null
        }
      }
      setIsLoading(false)
    }

    fetchTweets()
  }, [ selectedCity ])

  if (!selectedCity) return null

  return (
    <div className="flex w-full flex-col rounded-2xl border border-spruce lg:min-w-96 lg:max-w-96">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-extrabold">{selectedCity.city} İlgili Tweetler</h1>
        <button
          className="flex size-[34px] items-center justify-center rounded-full transition-all duration-200 hover:bg-porcelain/10 active:bg-porcelain/20"
          onClick={() => setSelectedCity(null)}
          title="Kapat"
          aria-label="Kapat"
        >
          <IconTimes className="size-5 fill-porcelain" />
        </button>
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
                <NotFound key={index} />
              )

              return (
                <Post key={index} tweet={tweet} />
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default Tweets