"use client"

import { getTweetCities } from "@/actions/tweets"
import IconSpinner from "@/icons/spinner.svg"
import { useMapStore } from "@/stores/useMapStore"
import Link from "next/link"
import { useEffect, useState } from "react"
import TurkeyMap from "./TurkeyMap"

const Map = () => {
  const { selectedCity, setSelectedCity } = useMapStore()
  const [ tweetCities, setTweetCities ] = useState<Record<string, string[]>>({})
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true)
      try {
        const citiesData = await getTweetCities()
        setTweetCities(citiesData)
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
            />
          )}
      </div>
      <Link href="https://github.com/yilmazev/protesto" target="_blank" className="hidden text-[13px] text-gray hover:underline lg:block">Kaynak Kodunu Görüntüle</Link>
    </div>
  )
}

export default Map
