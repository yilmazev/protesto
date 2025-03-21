import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

const twitterChirp = localFont({
  src: [
    { path: "./fonts/Chirp-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Chirp-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Chirp-Bold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Chirp-Heavy.woff2", weight: "700", style: "normal" }
  ],
  variable: "--font-twitter-chirp"
})

export const metadata: Metadata = {
  title: "Türkiye’deki Protestolar",
  description: "Türkiye’deki protestoları anlık olarak takip edin. Şehir seçerek o bölgedeki gösterilerle ilgili canlı tweetleri görüntüleyin."
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className={`${twitterChirp.className} bg-blackPearl text-haze antialiased`}>
        {children}
      </body>
    </html>
  )
}
