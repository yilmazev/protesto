import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }

  try {
    let tweetText = null

    try {
      const oEmbedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=1`
      const oEmbedResponse = await fetch(oEmbedUrl)
      const oEmbedData = await oEmbedResponse.json()

      if (oEmbedData?.html) {
        const match = oEmbedData.html.match(/<p.*?>(.*?)<\/p>/)
        tweetText = match ? match[1] : null
      }
    } catch (err) {
      console.warn("OEmbed API failed:", err)
    }

    try {
      const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })
      const html = await response.text()
      const titleMatch = html.match(/<meta property="og:title" content="(.*?)"/)
      if (!tweetText) tweetText = titleMatch ? titleMatch[1] : null
    } catch (err) {
      console.warn("OpenGraph data extraction failed:", err)
    }

    if (!tweetText) {
      return NextResponse.json({ error: "Tweet data not found" }, { status: 404 })
    }

    return NextResponse.json({ tweetText, tweetUrl: url })
  } catch (error) {
    console.error("Error fetching tweet:", error)
    return NextResponse.json({ error: "Failed to retrieve tweet" }, { status: 500 })
  }
}
