import { ITweet } from "@/types/ITweet"
import Image from "next/image"
import Link from "next/link"

const Tweet = ({ tweet }: { tweet: ITweet }) => {
  if (!tweet.url) return (
    <div className="tweet-content border-b border-spruce px-4 py-3 transition-all duration-200 last:border-0 hover:bg-[#ffffff08]">
      <p>Tweet silindi veya görüntülenemiyor</p>
    </div>
  )

  return (
    <Link href={tweet.url ?? ""} target="_blank" rel="noopener noreferrer" title={tweet.text} className="tweet-content border-b border-spruce px-4 py-3 transition-all duration-200 last:border-0 hover:bg-[#ffffff08]">
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center">
          <Link target="_blank" rel="noopener noreferrer" href={`https://x.com/${tweet.username}`} className="!text-haze">
            <p title={tweet.author} className="font-bold">{tweet.author}</p>
          </Link>
          <p className="ml-1 text-gray">@{tweet.username}</p>
        </div>
        <p className="break-all p-1" dangerouslySetInnerHTML={{ __html: tweet.text }} />
        {tweet.image && (
          <div className="relative mt-2 h-48 w-full overflow-hidden rounded-2xl">
            <Image src={tweet.image} alt={tweet.text} fill className="object-cover" />
          </div>
        )}
      </div>
    </Link>
  )
}

export default Tweet