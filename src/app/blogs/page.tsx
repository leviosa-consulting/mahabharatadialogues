import { Metadata } from 'next'
import BlogsClient from './BlogsClient'
import FooterWithBlogs from '@/components/FooterWithBlogs'

export const metadata: Metadata = {
  title: 'Blogs | Mahabharata Dialogues',
  description:
    'Read insightful blogs, research articles, teachings, and stories related to Mahabharata, spirituality, history, and Indian culture.',
}

export default function BlogsPage() {
  return (
    <>
      <BlogsClient initialBlogs={[]} />
      <div className="pt-16"  style={{
          backgroundImage: `
    linear-gradient(#47ABD8CC, #47ABD8CC),
    url('/MD-Texture_BG_Blue-01-04.png')
  `,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}>
        <FooterWithBlogs />
      </div>
    </>
  )
}
