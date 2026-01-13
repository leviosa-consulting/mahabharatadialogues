import React from 'react'
import HeroSection from '@/components/Hero'
import Testimonials from '@/components/Testimonials'
import ImageCarousel from '@/components/ImageCarousel'
import Retreats from '@/components/Retreats'

export default function Home() {
  
  return (
    <div
      className="w-full"
      style={{
        backgroundImage: "url('/MD-Texture_BG_Blue-01-04.png')",
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px',
      }}
    >
      <HeroSection />
      <Testimonials />
      <ImageCarousel />
      <Retreats />
    </div>
  )
}
