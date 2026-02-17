import AboutClient from './AboutClient'
import FooterWithBlogs from '@/components/FooterWithBlogs'

export default function Page() {
  return (
    <>
      <AboutClient members={[]} />
      <div className='pt-20'
        style={{
          backgroundImage: `
    linear-gradient(#1D5C75, #1D5C75),
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
