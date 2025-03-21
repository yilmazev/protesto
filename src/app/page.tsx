import Chats from "@/components/Chats"
import Map from "@/components/Map"
import Tweets from "@/components/Tweets"

export default function Home() {
  return (
    <main className="flex flex-col justify-between gap-2 p-2 lg:min-h-screen lg:flex-row lg:p-6">
      <Chats />
      <Map />
      <Tweets />
    </main>
  )
}
