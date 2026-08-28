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
  columns = 1,
}: {
  videos: Video[]
  count?: number
  layout?: 'row' | 'column'
  /* Cards per row on md+. Defaults to 1 so existing callers are unaffected;
     pair with layout="column", since a "row" card needs ~600px and won't fit
     a half-width column. */
  columns?: 1 | 2
}) {
  return (
    <div
      className={
        columns === 2 ? 'grid gap-10 md:grid-cols-2' : 'flex flex-col gap-10'
      }
    >
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
