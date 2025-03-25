"use client"

import { addPost } from "@/actions/posts"
import { useUsername } from "@/hooks/useUsername"
import IconSend from "@/icons/send.svg"
import { useState } from "react"

const NewPost = () => {
  const username = useUsername()
  const [ newMessage, setNewMessage ] = useState("")
  const [ isSubmitting, setIsSubmitting ] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !username) return

    setIsSubmitting(true)

    const response = await addPost(username, newMessage)

    if (response.error) {
      alert(response.error)
    } else {
      setNewMessage("")
      window.location.reload()
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-96 px-2 lg:px-0">
      <div className="flex min-h-11 items-center gap-1 rounded-2xl bg-stone p-1">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Acil yardım bildir"
          className="flex-1 bg-transparent px-3 py-1 placeholder:text-gray focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || isSubmitting}
          className="flex size-9 items-center justify-center rounded-full transition-all duration-200 hover:bg-primary/10 active:bg-primary/20 disabled:opacity-50 disabled:hover:bg-primary/0 disabled:active:bg-primary/0"
        >
          <IconSend className="size-5 text-primary" />
        </button>
      </div>
    </form>
  )
}

export default NewPost