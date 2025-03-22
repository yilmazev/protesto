import Chats from "./components/Chats"
import Map from "./components/Map"
import Trending from "./components/Trending"
import Tweets from "./components/Tweets"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col justify-between gap-2 p-2 !pt-0 lg:flex-row lg:p-6">
      <Chats />
      <Map />
      <Trending />
      <Tweets />
    </div>
  )
}
