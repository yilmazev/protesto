"use server"

import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../config/firebase"

export async function getBoycotts() {
  const q = query(collection(db, "boycotts"), orderBy("timestamp", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => doc.data())
}