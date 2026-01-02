import React from 'react'
import Hero from './components/Hero'
import Testimonials from './components/Testimonials'
import ImageCarousel from './components/ImageCarousel'
import Retreats from './components/Retreats'

export default function Home() {
  return (
    <div
      className=""
      //  style={{
      //     backgroundImage: `url('/Blue_Background_with_Texture-01.png')`,
      //     backgroundSize: 'cover',
      //     backgroundRepeat: 'no-repeat',
      //     backgroundPosition: 'center',
      //   }}
    >
      <Hero />
      <Testimonials />
      <div className="relative ">
        <ImageCarousel />
      </div>
      <Retreats />
    </div>
  )
}
