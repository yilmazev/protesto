"use client"

import IconSpinner from "@/icons/spinner.svg"
import IconTimes from "@/icons/times.svg"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useMapStore } from "../stores/useMapStore"
import { ITweet } from "../types/ITweet"

const Tweets = () => {
  const { selectedCity, setSelectedCity } = useMapStore()
  const [ tweets, setTweets ] = useState<ITweet[]>([])
  const [ isLoading, setIsLoading ] = useState(true)
  const [ chatHeight, setChatHeight ] = useState<number>(500)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const chatWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateChatHeight = () => {
      if (chatWrapperRef.current) {
        const windowHeight = window.innerHeight
        const wrapperTop = chatWrapperRef.current.getBoundingClientRect().top
        const newHeight = windowHeight - wrapperTop - 160
        setChatHeight(newHeight > 200 ? newHeight : 200)
      }
    }

    updateChatHeight()
    window.addEventListener("resize", updateChatHeight)

    return () => window.removeEventListener("resize", updateChatHeight)
  }, [])

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

  if (!selectedCity) return <div />

  return (
    <div ref={chatWrapperRef} className="flex min-w-96 max-w-96 flex-col rounded-2xl border border-spruce">
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
            <div className="flex items-center justify-center">
              <IconSpinner className="size-[26px] animate-spin" />
            </div>
          )
          : (
            <div
              ref={chatContainerRef}
              className="flex min-h-full flex-col overflow-y-auto"
              style={{ maxHeight: `${chatHeight}px` }}
            >
              {tweets.map((tweet, index) => (
                <div key={index} className="border-b border-spruce last:border-0">
                  <div className="tweet-content px-4 py-3">
                    <p dangerouslySetInnerHTML={{ __html: tweet.text }} />
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