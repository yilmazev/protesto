import Chats from "@/components/Chats"
import Map from "@/components/Map"
import Tweets from "@/components/Tweets"

export default function Home() {
  return (
    <main className="flex min-h-screen justify-between p-6">
      <Chats />
      <Map />
      <Tweets />
    </main>
  )
}
