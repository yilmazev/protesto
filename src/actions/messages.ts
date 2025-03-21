"use server"

import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore"
import { db } from "../config/firebase"
import { IMessage } from "../types/IMessage"

export async function addMessage(username: string, message: string) {
  if (!message.trim()) return { error: "The message can't be empty!" }

  try {
    await addDoc(collection(db, "chats"), {
      username,
      message,
      timestamp: serverTimestamp()
    })

    return { success: true }
  } catch (error) {
    console.error("Error adding message:", error)
    throw error
  }
}

export async function getMessages() {
  const q = query(collection(db, "chats"), orderBy("timestamp", "asc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  } as IMessage))
}