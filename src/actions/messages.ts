"use server"

import { db } from "@/config/firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"

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
    return { error: "Error adding message" }
  }
}