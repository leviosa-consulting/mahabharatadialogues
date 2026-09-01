

import LatestBlogs from '@/lib/LatestBlogs'
import YouTubeSection from './YouTubeSection'
import Footer from './Footer'
import { merri } from '@/app/fonts/merri'


type Blog = {
  id: string
  title: string
  slug: string
  image_url?: string
  updated_at?: string
}

export default function FooterWithBlogsClient({
  blogs,
  videos,
  count = 2,
  showBlogs = true,
}: {
  blogs: Blog[]
  videos: any[]
  count?: number
  /* Hide the "ON OUR BLOG" column and let YouTube fill the card instead. */
  showBlogs?: boolean
}) {


  return (
    <div>
      {/* youtube/blogs */}
      <div>
        <div className="mx-4 xl:mx-40 overflow-hidden bg-[#1D5C7580]">
          <div className="grid grid-cols-1 md:grid-cols-10 xl:grid-cols-12">
            
            {/* YOUTUBE */}
            <div
              className={`order-1 md:order-0 col-start-1 bg-[#D1212780] ${
                showBlogs
                  ? 'md:col-span-6 xl:col-span-8'
                  : 'md:col-span-10 xl:col-span-12'
              }`}
            >
              <div className="flex flex-col gap-6 px-6 py-8">
                <h2
                  className={`${merri.className} text-[18px] text-center md:text-left text-white font-bold`}
                >
                  LATEST ON YOUTUBE
                </h2>

                {/* Without the blog panel this column spans the full row, so fill it with
                    the two-up grid — the same treatment RetreatsClient uses. getLatestVideos
                    always returns two, so the second one is already to hand. "column" is
                    required alongside columns={2}: a "row" card needs ~600px. */}
                {showBlogs ? (
                  <YouTubeSection videos={videos} count={1} layout="row" />
                ) : (
                  <YouTubeSection
                    videos={videos}
                    count={2}
                    columns={2}
                    layout="column"
                  />
                )}
              </div>
            </div>

            {/* BLOG */}
            {showBlogs && (
              <div className="order-2 md:order-0 md:col-start-7 xl:col-start-9 col-span-4 bg-[#47ABD880]">
                <div className="flex flex-col px-6 py-8">
                  <h2
                    className={`${merri.className} text-white font-bold text-[18px] text-center md:text-left`}
                  >
                    ON OUR BLOG
                  </h2>

                  <LatestBlogs blogs={blogs} count={count} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTACT — the shared section, identical to the one the home page renders */}
      <Footer />
    </div>
  )
}