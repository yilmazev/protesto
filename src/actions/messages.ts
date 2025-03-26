"use server"

import { db } from "@/config/firebase"
import { emoteConvert, utmRemover } from "@/utils/utils"
import { checkIsValid, replaceWordWith } from 'badword-filter'
import { addDoc, collection, serverTimestamp } from "firebase/firestore"

export async function addMessage(username: string, message: string) {
  if (!message.trim()) return { error: "The message can't be empty!" }

  interface ValidationOptions {
    language: string;
    swear?: boolean;
    negative?: boolean;
    political?: boolean;
    religion?: boolean;
  }

  const ValidationOptionTR: ValidationOptions = {
    language: "tr",
    swear: true,
    negative: true,
    political: false,
    religion: true
  };

  const ValidationOptionEN: ValidationOptions = {
    language: "en",
    swear: true,
  };

  // Burada false döndüğü taktirde kötü kelime olduğu algılanıyor ve replaceWordWith fonksiyonu ile * karakteri ile değiştiriliyor.
  if (!await checkIsValid(message, ValidationOptionTR)) {
    message = await replaceWordWith(message, "*", ValidationOptionTR);
  }

  if (!await checkIsValid(message, ValidationOptionEN)) {
    message = await replaceWordWith(message, "*", ValidationOptionEN);
  }

  // URL utm parameters are removed.
  message = utmRemover(message)
  message = emoteConvert(message)

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