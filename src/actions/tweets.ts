"use server"

import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../config/firebase"

export async function getTweetCities() {
  const q = query(collection(db, "tweets"), orderBy("timestamp", "desc"))
  const snapshot = await getDocs(q)
  const cities = snapshot.docs.map((doc) => doc.data())

  const groupedCities = cities.reduce((acc, city) => {
    if (!acc[city.city]) {
      acc[city.city] = []
    }
    acc[city.city].push({ tweetUrl: city.tweetUrl, timestamp: city.timestamp })
    return acc
  }, {} as Record<string, { tweetUrl: string; timestamp: number }[]>)

  return groupedCities
}