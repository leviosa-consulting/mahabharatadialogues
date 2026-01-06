import YouTubeVideoCard from './YouTubeVideoCard'

type Video = {
  id: string
  title: string
  publishedAt: string
}

export default function YouTubeSection({
  videos,
  count = 2,
  layout = 'row',
}: {
  videos: Video[]
  count?: number
  layout?: 'row' | 'column'
}) {
  return (
    <div className="flex flex-col gap-10">
      {videos.slice(0, count).map((video) => (
        <YouTubeVideoCard
          key={video.id}
          video={video}
          layout={layout}
        />
      ))}
    </div>
  )
}
