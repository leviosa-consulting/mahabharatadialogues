import React from 'react'
import HeroSection from '@/components/Hero'
import ImageCarousel from '@/components/ImageCarousel'
import Retreats from '@/components/Retreats'
import MobileNavbarScroll from '@/components/MobileNavbarScroll'
import UpcomingEventsServer from '@/components/UpcomingEventsServer'
import CTAStrip from '@/components/CTAStrip'

export const runtime = 'nodejs'
export const revalidate = 3600


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
      <MobileNavbarScroll textColor="#1D5C75" showOnScrollUp={true} />

      {/* Hero + CTA strip share a full-viewport flex column so both are always visible */}
      <div className="flex flex-col h-[100svh]">
        <HeroSection />
        <CTAStrip />
      </div>

      <UpcomingEventsServer />

      <ImageCarousel />
      <Retreats />
    </div>
  )
}
