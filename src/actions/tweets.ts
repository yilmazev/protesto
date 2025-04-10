"use server"

import { db } from "@/config/firebase"
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore"

export async function getTweets() {
  const q = query(collection(db, "tweets"), orderBy("timestamp", "desc"), limit(30))
  const snapshot = await getDocs(q)
  const cities = snapshot.docs.map((doc) => doc.data())

  return cities
}

export async function getTweetCities() {
  const q = query(collection(db, "tweets"), orderBy("timestamp", "desc"))
  const snapshot = await getDocs(q)
  const cities = snapshot.docs.map((doc) => doc.data())

  const groupedCities = cities.reduce((acc, city) => {
    if (!acc[city.city]) {
      acc[city.city] = []
    }
    acc[city.city].push(city.tweetUrl)
    return acc
  }, {} as Record<string, { tweetUrl: string; timestamp: number }[]>)

  return groupedCities
}