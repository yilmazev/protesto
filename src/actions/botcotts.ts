"use server"

import { db } from "@/config/firebase"
import { collection, getDocs, orderBy, query } from "firebase/firestore"

export async function getBoycotts() {
  const q = query(collection(db, "boycotts"), orderBy("timestamp", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => doc.data())
}