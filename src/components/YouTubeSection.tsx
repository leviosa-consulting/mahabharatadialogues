import { getLatestVideos } from '@/lib/youtube'
import { merri } from '@/app/fonts/merri'

export default async function YouTubeSection() {
  const videos = await getLatestVideos()

  return (
    <div className="flex flex-col gap-10">
      {videos.map((video) => (
        <div
          key={video.id}
          className="
            flex flex-col gap-4
            md:flex-row md:gap-3 md:items-center
          "
        >
          {/* VIDEO */}
          <div
            className="
              w-full aspect-video overflow-hidden 
              md:w-[284px] md:aspect-284/186 md:rounded-none
            "
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
            className="
              text-white
              text-center md:text-left
              md:max-w-[300px]
            "
          >
            <h2
              className={`${merri.className} font-bold text-[14px] md:text-[18px]`}
            >
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
                text-[16px] md:text-[18px]
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
      ))}
    </div>
  )
}
