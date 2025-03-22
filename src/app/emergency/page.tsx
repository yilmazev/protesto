import NewPost from "./components/NewPost"
import Posts from "./components/Posts"

export default function Emergency() {
  return (
    <div className="flex flex-col items-center gap-4">
      <NewPost />
      <Posts />
    </div>
  )
}
