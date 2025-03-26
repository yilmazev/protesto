import Image from "next/image"
import Link from "next/link"

const Post = ({ tweet }: { tweet: any }) => {
  return (
    <Link href={tweet.url} target="_blank" rel="noopener noreferrer" title={tweet.text} className="tweet-content border-b border-spruce px-4 py-3 transition-all duration-200 last:border-0 hover:bg-[#ffffff08]">
      <div className="flex flex-col">
        <div className="flex items-center">
          <a target="_blank" rel="noopener noreferrer" href={`https://x.com/${tweet.username}`}><p title={tweet.author} className="font-bold">{tweet.author}</p></a>
          <a target="_blank" rel="noopener noreferrer" href={`https://x.com/${tweet.username}`}><p title={tweet.username} className="ml-1 text-gray">@{tweet.username}</p></a>
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

export default Post