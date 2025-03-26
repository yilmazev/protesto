import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  try {
    let tweetText = null
    let author = null
    let username = null
    let image = null

    try {
      const oEmbedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=1`
      const oEmbedResponse = await fetch(oEmbedUrl)
      const oEmbedData = await oEmbedResponse.json()

      if (oEmbedData?.html) {
        const match = oEmbedData.html.match(/<p.*?>(.*?)<\/p>/)
        tweetText = match ? match[1] : null

        if (oEmbedData.author_name) {
          author = oEmbedData.author_name
        }

        if (oEmbedData.author_url) {
          const usernameMatch = oEmbedData.author_url.match(/https:\/\/twitter.com\/(.*?)(\/|$)/)
          username = usernameMatch ? usernameMatch[1] : null
        }
      }
    } catch (err) {
      console.warn("OEmbed API failed:", err)
    }

    try {
      const response = await fetch(url, { headers: { "User-Agent": "Twitterbot" } })
      if (response.ok) {
        const html = (await response.text()).replaceAll("\n", " ").replaceAll("\r", " ").replaceAll("\t", " ").replaceAll("  ", " ")
        const titleMatch = html.match(/<meta content="([^"]+)" property="og:description" \/>/)
        if (!tweetText) {
          tweetText = titleMatch ? titleMatch[1] : null
        }
        if (!author) {
          const authorMatch = html.match(/<meta content="([^"]+?) \(@.*?\) on X" property="og:title" \/>/)
          author = authorMatch ? authorMatch[1] : null
        }
        if (!username) {
          const usernameMatch = html.match(/<meta content=".*? \(@([^"]+?)\) on X" property="og:title" \/>/)
          username = usernameMatch ? usernameMatch[1] : null
        }
        if (!image) {
          const imageMatch = html.match(/<meta content="([^"]+?)" property="og:image" \/>/)
          image = imageMatch ? imageMatch[1] : null
        }
      }
    } catch (err) {
      console.warn("OpenGraph data extraction failed:", err)
    }

    if (!tweetText) {
      return NextResponse.json({ error: "Tweet data not found" }, { status: 404 })
    }

    tweetText = tweetText.replace(/<a /g, "<a target=\"_blank\" ").replaceAll(/\?src=hash&ref_src=twsrc%5Etfw/g, "")

    return NextResponse.json({ tweetText, author, username, image, tweetUrl: url })
  } catch (error) {
    console.error("Error fetching tweet:", error)
    return NextResponse.json({ error: "Failed to retrieve tweet" }, { status: 500 })
  }
}
