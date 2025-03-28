"use client"

import { addMessage } from "@/actions/messages"
import { db } from "@/config/firebase"
import { useUsername } from "@/hooks/useUsername"
import IconSend from "@/icons/send.svg"
import IconSpinner from "@/icons/spinner.svg"
import { IBubble } from "@/types/IBubble"
import { IMessage } from "@/types/IMessage"
import { convertMessage, formatDate } from "@/utils/utils"
import clsx from "clsx"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"

const Bubble: React.FC<IBubble> = ({ message }) => {
  const isMe = (message.username === useUsername())
  const timestamp = message.timestamp.seconds * 1000

  return (
    <div className={clsx("flex w-full flex-col", isMe && "items-end self-end")}>
      <div className={clsx("w-fit rounded-3xl px-4 py-3", isMe ? "rounded-br-sm bg-primary" : "rounded-bl-sm bg-fiord")}>
        <p className="break-words text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: convertMessage(message.message) }} />
      </div>
      <div className="flex items-center text-[13px] text-gray">
        <span className={clsx("overflow-hidden whitespace-nowrap", isMe && "text-right")}>{message.username}</span>
        <span className="ml-1" title={formatDate(timestamp, 4)}> · {formatDate(timestamp, 2)}</span>
      </div>
    </div>
  )
}

const Chat = () => {
  const username = useUsername()
  const [ messages, setMessages ] = useState<IMessage[]>([])
  const [ newMessage, setNewMessage ] = useState("")
  const [ isLoading, setIsLoading ] = useState(true)
  const [ isThrottled, setIsThrottled ] = useState(false)
  const [ throttleEndTime, setThrottleEndTime ] = useState<number | null>(null)
  const [ messageCount, setMessageCount ] = useState(0)
  const [ countdown, setCountdown ] = useState(60)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedEnd = localStorage.getItem("flood_throttle_until")
    if (storedEnd) {
      const endTime = parseInt(storedEnd)
      const now = Date.now()
      if (endTime > now) {
        setIsThrottled(true)
        setThrottleEndTime(endTime)
        setCountdown(Math.ceil((endTime - now) / 1000))
      } else {
        localStorage.removeItem("flood_throttle_until")
      }
    }
  }, [])

  useEffect(() => {
    if (isThrottled && throttleEndTime) {
      const interval = setInterval(() => {
        const now = Date.now()
        const remaining = throttleEndTime - now
        if (remaining <= 0) {
          clearInterval(interval)
          setIsThrottled(false)
          setMessageCount(0)
          setThrottleEndTime(null)
          localStorage.removeItem("flood_throttle_until")
        } else {
          setCountdown(Math.ceil(remaining / 1000))
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [ isThrottled, throttleEndTime ])

  useEffect(() => {
    if (!username) return

    setIsLoading(true)

    const q = query(collection(db, "chats"), orderBy("timestamp", "asc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as IMessage[]

      setMessages(messages)
      setIsLoading(false)
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    })

    return () => unsubscribe()
  }, [ username ])

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !username?.trim() || isThrottled) return

    await addMessage(username, newMessage)
    setNewMessage("")

    setMessageCount((prev) => prev + 1)

    if (messageCount >= 4) {
      const until = Date.now() + 60000
      setIsThrottled(true)
      setThrottleEndTime(until)
      localStorage.setItem("flood_throttle_until", until.toString())
    }
  }

  return (
    <div className="flex w-full flex-col rounded-2xl border border-spruce lg:min-w-96 lg:max-w-96">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-extrabold">Topluluk Sohbeti</h1>
      </div>
      <div className="h-full flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex size-full items-center justify-center">
            <IconSpinner className="size-[26px] animate-spin" />
          </div>
        ) : (
          <div ref={chatContainerRef} className="flex h-full !max-h-80 min-h-full flex-col gap-6 overflow-y-auto px-4 py-3 lg:h-auto">
            {messages.map((msg) => (
              <Bubble key={msg.id} message={msg} />
            ))}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="border-t border-spruce">
          <div className="mx-3 my-1 flex min-h-11 items-center gap-1 rounded-2xl bg-stone p-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isThrottled ? `${countdown} saniye sonra tekrar dene` : "Yeni bir mesaja başla"}
              maxLength={100}
              className="flex-1 bg-transparent px-3 py-1 placeholder:text-gray focus:outline-none"
              disabled={isThrottled}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isThrottled}
              className="flex size-9 items-center justify-center rounded-full transition-all duration-200 hover:bg-primary/10 active:bg-primary/20 disabled:opacity-50 disabled:hover:bg-primary/0 disabled:active:bg-primary/0"
              title="Gönder"
              aria-label="Gönder"
            >
              <IconSend className="size-5 text-primary" />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Chat