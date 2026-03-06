import { cache } from 'react'

type Video = {
  id: string
  title: string
  publishedAt: string
}

/* 🔒 FALLBACK VIDEOS (STATIC) */
const FALLBACK_VIDEOS: Video[] = [
  {
    id: 'tw7d2hMHyRY',
    title:
      'A Weekend of Wisdom: Inside the Mahabharata Retreat (Second Edition) Experience',
    publishedAt: '2025-02-28',
  },
  {
    id: 'vzIB3zXqMVk',
    title: 'Join us for a 2-day Mahabharata Retreat at Fireflies Ashram!',
    publishedAt: '2025-01-24',
  },
]

export const getLatestVideos = cache(async (): Promise<Video[]> => {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

    if (!API_KEY || !CHANNEL_ID) {
      console.warn('Missing YouTube API credentials. Using fallback.')
      return FALLBACK_VIDEOS
    }

    const url =
      `https://www.googleapis.com/youtube/v3/search` +
      `?key=${API_KEY}` +
      `&channelId=${CHANNEL_ID}` +
      `&part=snippet` +
      `&order=date` +
      `&maxResults=5` +
      `&type=video` +
      `&videoDuration=medium`

    const res = await fetch(url, {
      next: { revalidate: 3600
 }, 
    })

    if (!res.ok) {
      console.error('YouTube API failed:', res.status)
      return FALLBACK_VIDEOS
    }

    const data = await res.json()

    if (!Array.isArray(data.items) || data.items.length === 0) {
      console.warn('No valid videos returned. Using fallback.')
      return FALLBACK_VIDEOS
    }

    const videos = data.items.slice(0, 2).map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      publishedAt: item.snippet.publishedAt,
    }))

    return videos.length === 2 ? videos : FALLBACK_VIDEOS
  } catch (error) {
    console.error('YouTube fetch error:', error)
    return FALLBACK_VIDEOS
  }
})
