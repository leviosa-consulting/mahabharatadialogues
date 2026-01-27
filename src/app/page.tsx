import React from 'react'
import HeroSection from '@/components/Hero'
import Testimonials from '@/components/Testimonials'
import ImageCarousel from '@/components/ImageCarousel'
import Retreats from '@/components/Retreats'
import Navbar from '@/components/Navbar'
import UpcomingEvents from '@/components/Upcomingevents'

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default function Home() {
  
  return (
    <div
      className="relative w-full bg-texture"
      style={{
        backgroundImage: "url('/MD-Texture_BG_Blue-01-04.png')",
        backgroundRepeat: 'repeat',
        backgroundSize: '240px 240px',
      }} 
    >
      <HeroSection />
      <UpcomingEvents />
      <ImageCarousel />
      <Retreats />
      {/* <Navbar /> */}
    </div>
  )
}
