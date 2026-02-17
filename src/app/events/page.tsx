import FooterWithBlogs from '@/components/FooterWithBlogs'
import EventsClient from './EventsClient'

export default function EventsPage() {
  return (
    <>
      <EventsClient upcomingEvents={[]} pastEvents={[]} />
      <div className="pt-16" style={{
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
