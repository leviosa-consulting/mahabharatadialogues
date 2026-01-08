import React from 'react'
import HeroSection from '@/components/Hero'
import Testimonials from '@/components/Testimonials'
import ImageCarousel from '@/components/ImageCarousel'
import Retreats from '@/components/Retreats'

export default function Home() {
  return (
    <div className='w-full h-full overflow-hidden'  style={{
        backgroundImage: `url('/Blue_Background_with_Texture-01.png')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}>
      <HeroSection />
      <Testimonials />

      <ImageCarousel />

      <Retreats />
    </div>
  )
}
