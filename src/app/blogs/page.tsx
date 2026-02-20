// app/blogs/page.tsx
import { Metadata } from 'next'
import { Suspense } from 'react'
import BlogsClient from './BlogsClient'
import { getBlogs } from '@/lib/data/blogs'
import FooterWithBlogs from '@/components/FooterWithBlogs'

export const metadata: Metadata = {
  title: 'Blogs | Mahabharata Dialogues',
  description:
    'Read insightful blogs, research articles, teachings, and stories related to Mahabharata, spirituality, history, and Indian culture.',
}

export const runtime = 'nodejs'
export const revalidate = 43200


export default async function BlogsPage() {
  const blogs = await getBlogs()

  return (
    <>
      <Suspense fallback={null}>
        <BlogsClient initialBlogs={blogs} />
      </Suspense>

      <div
        className="pt-16"
        style={{
          backgroundImage: `
            linear-gradient(#47ABD8CC, #47ABD8CC),
            url('/MD-Texture_BG_Blue-01-04.png')
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}
      >
        <FooterWithBlogs />
      </div>
    </>
  )
}
