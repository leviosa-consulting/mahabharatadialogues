import React from 'react'
import Hero from './components/Hero'
import Testimonials from './components/Testimonials'
import ImageCarousel from './components/ImageCarousel'

export default function Home() {
  return (
    <div>
      <Hero />
      <Testimonials />
      <ImageCarousel />
    </div>
  )
}
