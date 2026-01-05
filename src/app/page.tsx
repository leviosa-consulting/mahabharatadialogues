import React from 'react'
import Hero from './components/Hero'
import Testimonials from './components/Testimonials'
import ImageCarousel from './components/ImageCarousel'
import Retreats from './components/Retreats'

export default function Home() {
  return (
    <div>
      <Hero />
      <Testimonials />

      <ImageCarousel />

      <Retreats />
    </div>
  )
}
