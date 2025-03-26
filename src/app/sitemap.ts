import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.protesto.cc",
      lastModified: new Date(),
      priority: 1
    },
    {
      url: "https://www.protesto.cc/emergency",
      lastModified: new Date(),
      priority: 1
    },
    {
      url: "https://www.protesto.cc/boycott",
      lastModified: new Date(),
      priority: 1
    }
  ]
}