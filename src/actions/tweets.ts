"use server"

import { collection, getDocs } from "firebase/firestore"
import { db } from "../config/firebase"

export async function getTweetCities() {
  const snapshot = await getDocs(collection(db, "tweets"))
  const cities = snapshot.docs.map((doc) => doc.data())

  const groupedCities = cities.reduce((acc, city) => {
    if (!acc[city.city]) {
      acc[city.city] = []
    }
    acc[city.city].push(city.tweetUrl)
    return acc
  }, {} as Record<string, string[]>)

  return groupedCities
}