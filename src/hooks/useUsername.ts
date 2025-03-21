"use client"
import { getRandomUsername } from "@/utils/utils"
import { useEffect, useState } from "react"

export function useUsername() {
  const [ username, setUsername ] = useState<string | null>(null)

  useEffect(() => {
    let storedUsername = localStorage.getItem("chatUsername")
    if (!storedUsername) {
      storedUsername = getRandomUsername()
      localStorage.setItem("chatUsername", storedUsername)
    }
    setUsername(storedUsername)
  }, [])

  return username
}
