"use server"

import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore"
import { db } from "../config/firebase"

export async function addPost(username: string, message: string) {
  if (!username || !message.trim()) {
    return { error: "Username and message are required" }
  }

  try {
    await addDoc(collection(db, "posts"), {
      username,
      message,
      timestamp: serverTimestamp()
    })

    return { success: "Post successfully added!" }
  } catch (error) {
    console.error("Error adding post:", error)
    return { error: "Failed to add post" }
  }
}

export async function getPosts() {
  try {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"))
    const snapshot = await getDocs(q)
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      username: doc.data().username,
      message: doc.data().message,
      timestamp: doc.data().timestamp?.seconds * 1000 || Date.now()
    }))
    return posts
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}
