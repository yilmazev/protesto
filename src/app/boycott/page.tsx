"use client"

import { getBoycotts } from "@/actions/botcotts"
import IconSpinner from "@/icons/spinner.svg"
import { IBoycott } from "@/types/IBoycott"
import Image from "next/image"
import { useEffect, useState } from "react"

const BoycottList = () => {
  const [ boycotts, setBoycotts ] = useState<IBoycott[]>([])
  const [ isLoading, setIsLoading ] = useState(true)
  const [ searchTerm, setSearchTerm ] = useState("")

  useEffect(() => {
    const fetchBoycotts = async () => {
      setIsLoading(true)
      const data = await getBoycotts()
      setBoycotts(data.map((doc: any) => ({ name: doc.name, logo: doc.logo })))
      setIsLoading(false)
    }

    fetchBoycotts()
  }, [])

  const filteredBoycotts = boycotts.filter((boycott) =>
    boycott.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full max-w-4xl flex-col items-center p-2">
        <div className="mb-4 flex w-full max-w-96 items-center gap-1 rounded-2xl bg-stone p-1">
          <input
            type="text"
            placeholder="Marka ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent px-3 py-1 placeholder:text-gray focus:outline-none"
          />
        </div>
        <div className="w-full">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <IconSpinner className="size-[26px] animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-4">
              {filteredBoycotts.map((boycott, index) => (
                <div key={index} className="flex items-center gap-4 rounded-2xl border border-spruce p-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-spruce bg-white">
                    <Image src={boycott.logo} alt={boycott.name} fill className="object-contain" />
                  </div>
                  <p className="text-lg font-bold">{boycott.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BoycottList