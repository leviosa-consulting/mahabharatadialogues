"use client"
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react'

export default function MahabharataDialogues() {
  const testimonials = [
    {
      quote: "Quotes on how amazing it is to be in any of the workshop, long or short, and what an enriching time you had with information and meeting like-minded people.",
      name: "Hansini",
      designation: "President of Rotary Club, Bengaluru"
    },
    {
      quote: "An absolutely transformative experience! The depth of knowledge shared and the passionate discussions made this workshop truly unforgettable.",
      name: "Rajesh Kumar",
      designation: "Cultural Enthusiast, Bengaluru"
    },
    {
      quote: "The storytelling sessions brought ancient wisdom to life. I learned so much about our heritage and connected with wonderful people.",
      name: "Priya Sharma",
      designation: "Teacher, Bengaluru"
    },
    {
      quote: "Every session was enlightening. The facilitators made complex philosophical concepts accessible and engaging for everyone.",
      name: "Anil Menon",
      designation: "Business Owner, Bengaluru"
    },
    {
      quote: "A beautiful blend of tradition and modern interpretation. The workshops exceeded all my expectations!",
      name: "Kavita Reddy",
      designation: "Artist, Bengaluru"
    },
    {
      quote: "The community we built during these sessions is invaluable. Great learning, great people, great memories!",
      name: "Vikram Singh",
      designation: "Software Engineer, Bengaluru"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const wheelTimeout = useRef(null);

  const handleWheel = (e) => {
    e.preventDefault();
    
    if (wheelTimeout.current) {
      clearTimeout(wheelTimeout.current);
    }

    wheelTimeout.current = setTimeout(() => {
      if (e.deltaY > 0 || e.deltaX > 0) {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      } else if (e.deltaY < 0 || e.deltaX < 0) {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      }
    }, 50);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-blue-500  relative overflow-hidden">
      {/* Decorative dots pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, #1e3a8a 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      ></div>

      <div className="relative">
        {/* Top Section with Faces and Title */}
        <div className="flex items-center justify-between gap-5 mb-12">
          {/* Left Face */}
          <div className="">
            <img src="Web_Assets-07.png" alt="" />
          </div>

          {/* Center Circle with Title */}
         <div className='md:mb-30'>
          <img src="Web_Assets-08.png" alt="" />
         </div>

          {/* Right Face */}
          <div className="">
          <img src="Web_Assets-09.png" alt="" />
          </div>
        </div>

        {/* Quote Section */}
        <div className="bg-opacity-60  rounded-lg p-6 -mt-12 sm:-mt-40 md:-mt-48 xl:-mt-66 sm:mx-40 md:mx-60 lg:mx-90 xl:mx-[450px] 2xl:mx-[500px] text-center ">
          <p className="text-white text-lg italic leading-relaxed ">
            {testimonials[currentIndex].quote}
          </p>
          <p className="text-white mt-4 font-semibold">{testimonials[currentIndex].name}</p>
          <p className="text-white text-sm">
            {testimonials[currentIndex].designation}
          </p>
        </div>

        {/* Event Banner */}
        <div className="bg-[#1D5C75] bg-opacity-80 p-4 mb-8 text-center mx-4 sm:max-w-[320px] sm:mx-auto">
          <p className="text-white merriweather-sans font-extrabold text-[18px]">
            STORYTELLING @ JP NAGAR
          </p>
          <p className="text-white merriweather-sans font-normal text-[18px]">BENGALURU</p>
        </div>
        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mb-18">
          {testimonials.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                index === currentIndex ? 'bg-white' : 'bg-gray-400'
              }`}
            ></div>
          ))}
        </div>

       <div className='max-w-5xl mx-auto mt-10'>
         {/* Button Section */}
         <div className="grid grid-cols-1 px-4 md:grid-cols-3 gap-4 mb-12">
      <button className="bg-[#1D5C75] merriweather-sans font-extrabold text-[18px] text-white py-4 px-6 transition duration-300">
        YOUTUBE
      </button>

      <button className="bg-[#1D5C75] merriweather-sans text-[18px] text-white py-4 px-6 transition duration-300">
        <div className="font-extrabold">THE RETREAT</div>
        <div className="font-normal">7-8 DEC</div>
      </button>

      <Link
        href="/blogs"
        className="bg-[#1D5C75] merriweather-sans font-extrabold text-[18px] text-white py-4 px-6 transition duration-300 text-center flex items-center justify-center"
      >
        BLOG
      </Link>
    </div>
        {/* Footer */}
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-end text-white pb-10 mx-8">
          <Link href={"/events"}>
            <p className="text-xl font-semibold">Photos from</p>
            <p className="text-xl font-semibold">our events</p>
          </Link>
          <div className="text-right">
            <p className="text-lg mb-2">mahabharatadialogues@gmail.com</p>
            <p className="text-lg text-center">+91 00000 00000</p>
          </div>
        </div>
       </div>
      </div>
    </div>
  )
}