"use client"

import { getTweetCities } from "@/actions/tweets"
import TurkeyMap from "@/components/TurkeyMap"
import IconSpinner from "@/icons/spinner.svg"
import { useMapStore } from "@/stores/useMapStore"
import Link from "next/link"
import { useEffect, useState } from "react"

const Map = () => {
  const { selectedCity, setSelectedCity } = useMapStore()
  const [ tweetCities, setTweetCities ] = useState<Record<string, string[]>>({})
  const [ isLoading, setIsLoading ] = useState(true)
  const [ averageTweetCount, setAverageTweetCount ] = useState(0)

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true)
      try {
        const citiesData = await getTweetCities()
        setTweetCities(citiesData)

        const allTweetCounts = Object.values(citiesData).map((tweets) => tweets.length)
        const totalTweets = allTweetCounts.reduce((sum, count) => sum + count, 0)
        const average = allTweetCounts.length > 0 ? totalTweets / allTweetCounts.length : 0

        setAverageTweetCount(average)
      } catch (error) {
        console.error("Error fetching tweet cities:", error)
      }
      setIsLoading(false)
    }

    fetchCities()
  }, [])

  const handleCityClick = (cityName: string) => {
    if (tweetCities[cityName]) {
      setSelectedCity({ city: cityName, tweetUrls: tweetCities[cityName] })
    }
  }

  const getCityColor = (cityName: string) => {
    const tweetCount = tweetCities[cityName]?.length || 0

    if (tweetCount === 0) {
      return "fill-primary/10"
    }
    else if (tweetCount < averageTweetCount) {
      return "fill-primary/50"
    } else if (tweetCount < 2 * averageTweetCount) {
      return "fill-primary/80"
    } else {
      return "fill-primary/100"
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-between lg:px-4">
      <div className="relative flex size-full items-center justify-center">
        {isLoading
          ? <IconSpinner className="size-[26px] animate-spin" />
          : (
            <TurkeyMap
              tweetCities={Object.keys(tweetCities)}
              selectedCity={selectedCity?.city ?? ""}
              onClick={handleCityClick}
              getCityColor={getCityColor}
            />
          )}
      </div>
      <Link href="https://github.com/yilmazev/protesto" target="_blank" className="hidden text-[13px] text-gray hover:underline lg:block">Kaynak Kodunu Görüntüle</Link>
    </div>
  )
}

export default Map