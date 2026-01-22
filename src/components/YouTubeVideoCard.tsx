import { merri } from '@/app/fonts/merri'

type Video = {
  id: string
  title: string
  publishedAt: string
}

export default function YouTubeVideoCard({
  video,
  layout = 'row',
}: {
  video: Video
  layout?: 'row' | 'column'
}) {
  const isRow = layout === 'row'

  return (
    <div
      className={`
        flex gap-4
        ${isRow ? 'flex-col md:flex-row md:items-center' : 'flex-col'}
      `}
    >
      {/* VIDEO */}
      <div
        className={`
          w-full aspect-video overflow-hidden
          ${isRow ? 'md:w-[284px] md:aspect-284/186' : ''}
        `}
      >
        <iframe
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* TEXT */}
      <div
        className={`
          text-white
          ${isRow ? 'text-center md:text-left md:max-w-[300px]' : 'text-left'}
        `}
      >
        <h2 className={`${merri.className} font-bold text-[14px] md:text-[16px]`}>
          {new Date(video.publishedAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </h2>

        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            font-neco font-bold
            text-[18px] md:text-[20px]
            underline
            hover:text-gray-300
            transition
            block mt-2
          "
        >
          {video.title}
        </a>
      </div>
    </div>
  )
}
