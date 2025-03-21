import { cities } from "@/data/cities"
import clsx from "clsx"
import React from "react"
import { ITurkeyMap } from "../types/ITurkeyMap"

const TurkeyMap: React.FC<ITurkeyMap> = ({ tweetCities, selectedCity, onClick }) => {
  return (
    <div className="flex w-full justify-center">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 50 1007.478 527.323"
        className="h-auto w-full max-w-[1000px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <g>
          {cities.map((city) => {
            const hasTweet = tweetCities.includes(city.name)

            return (
              <g
                key={city.id}
                id={city.id}
                data-plakakodu={city.plateNumber}
                data-iladi={city.name}
                onClick={() => hasTweet && onClick(city.name)}
                className={clsx(hasTweet && "cursor-pointer")}
              >
                <path className={clsx(hasTweet ? "fill-primary/60" : "fill-primary/5", selectedCity === city.name && "!fill-primary")} d={city.path} />
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}

export default TurkeyMap