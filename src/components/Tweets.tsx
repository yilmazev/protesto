"use client"

import IconSpinner from "@/icons/spinner.svg"
import IconTimes from "@/icons/times.svg"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useMapStore } from "../stores/useMapStore"
import { ITweet } from "../types/ITweet"

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
            return { text: data.tweetText, url: data.tweetUrl }
          })
        )
        setTweets(tweetData)
      } catch (error) {
        console.error("Tweet data fetch failed:", error)
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
        {isLoading
          ? (
            <div className="flex items-center justify-center py-4">
              <IconSpinner className="size-[26px] animate-spin" />
            </div>
          )
          : (
            <div className="flex h-full !max-h-80 min-h-full flex-col overflow-y-auto lg:h-auto">
              {tweets.map((tweet, index) => (
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
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Tweets