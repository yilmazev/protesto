"use client"

import IconSpinner from "@/icons/spinner.svg"
import IconTimes from "@/icons/times.svg"
import { useMapStore } from "@/stores/useMapStore"
import { ITweet } from "@/types/ITweet"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

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
            const data = await response.json()
            return {
              text: data.tweetText,
              url: data.tweetUrl,
              author: data.author,
              username: data.username,
              image: data.image
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

export default Tweets