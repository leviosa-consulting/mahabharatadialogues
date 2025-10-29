'use client'
import { useWorkshopStore } from '../../store/useStore'
import React, { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'

const ImpactStory = ({ impactStoryData }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const scrollContainerRef = useRef(null)
  const {
    setShowImpactSections,
    setCurrentImpactSectionIndex,
    currentImpactSectionIndex,
  } = useWorkshopStore()

  // Safety checks for data
  const experienceData = impactStoryData?.experience || {}
  const bannerData = experienceData.banner || {}
  const ctaData = experienceData.cta || {}
  const methodologyPhases = experienceData.methodology?.phases || []
  const impactResults = experienceData.impact?.results || []

  // Reset scroll to top when component mounts
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
  }, [])

  const handleClose = () => {
    setCurrentSectionIndex(0)
    setShowImpactSections(-1)
    setCurrentImpactSectionIndex(0)
  }

  const handleOverlayClick = (e) => {
    // Only close if clicking directly on the overlay background
    if (e.target === e.currentTarget && e.type === 'click') {
      handleClose()
    }
  }

  const handleTouchMove = (e) => {
    // Prevent touch events from bubbling to parent
    e.stopPropagation()
  }

  const handleTouchStart = (e) => {
    // Prevent touch events from bubbling to parent
    e.stopPropagation()
  }

  const handleTouchEnd = (e) => {
    // Prevent touch events from bubbling to parent
    e.stopPropagation()
  }

  function scrollToFooter() {
  const footer = document.getElementById('footer')
  if (footer) {
    // Close the modal first
    setCurrentSectionIndex(0)
    setShowImpactSections(-1)
    setCurrentImpactSectionIndex(0)
    
    // Wait for modal to close before scrolling
    setTimeout(() => {
      footer.scrollIntoView({ behavior: 'smooth' })
    }, 300) 
  }
}

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center"
      onClick={handleOverlayClick}
    >
      <div
        ref={scrollContainerRef}
        className="w-full max-w-full sm:max-w-60vw h-full max-h-[100vh] mx-0 sm:mx-12 lg:mx-40 xl:mx-56 2xl:mx-70 overflow-y-auto scrollbar-hide"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full min-h-full">
          <div className="bg-white">
            {/* Main content container */}
            <div className="mx-0">
              {/* Image section with X button on mobile */}
              {bannerData.image && (
                <div className="relative bg-gray-200 mb-6 md:mb-10">
                  <div className="h-76 w-full">
                    <img
                      src={bannerData.image}
                      alt={bannerData.title || 'Impact story'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                  {/* X button for mobile - positioned on top right of image */}
                  <button
                    onClick={handleClose}
                    className="sm:hidden absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 border border-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              )}

              {/* Title section */}
              <div className="mb-2 px-4 sm:px-0">
                <h1
                  className="font-bold text-[#000] text-[36px] sm:text-[32px] lg:text-[40px] text-center leading-[1.3]"
                  style={{ fontFamily: 'var(--font-fira-sans)' }}
                >
                  {bannerData.title || impactStoryData?.title || 'Case Study'}
                </h1>
              </div>

              {/* Subtitle section */}
              {bannerData.subtitle && (
                <div className="mb-10 px-4 sm:px-6">
                  <p
                    className="font-normal text-[#000000] text-[24px] text-center leading-[1.3]"
                    style={{ fontFamily: 'var(--font-lato)' }}
                  >
                    {bannerData.subtitle}
                  </p>
                </div>
              )}

              {/* Main content sections */}
              <div className="space-y-6 px-0 md:mx-20 border-t-2 border-green py-10">
                {/* Objective Section */}
                {experienceData.objective && (
                  <div className="space-y-3 px-4">
                    <h2
                      className="font-bold flex items-center text-[18px] text-left lg:text-left"
                      style={{
                        fontFamily: 'var(--font-fira-sans)',
                      }}
                    >
                      <span className="w-8 h-8 bg-green rounded-full flex items-center justify-center mr-3 text-white">
                        1
                      </span>
                      Objective
                    </h2>
                    <p
                      className="text-black text-[18px] sm:text-[14px] lg:text-[16px] font-normal leading-relaxed ml-11 text-left lg:text-left"
                      style={{ fontFamily: 'var(--font-lato)' }}
                    >
                      {experienceData.objective}
                    </p>
                  </div>
                )}

                {/* Challenge Section */}
                {experienceData.challenge && (
                  <div className="space-y-3 px-4">
                    <h2
                      className="font-bold flex items-center text-[18px] text-left lg:text-left"
                      style={{
                        fontFamily: 'var(--font-fira-sans)',
                      }}
                    >
                      <span className="w-8 h-8 bg-green rounded-full flex items-center justify-center mr-3 text-white">
                        2
                      </span>
                      Challenge
                    </h2>
                    <p
                      className="text-black text-[18px] sm:text-[14px] lg:text-[16px] font-normal leading-relaxed ml-11 text-left lg:text-left"
                      style={{ fontFamily: 'var(--font-lato)' }}
                    >
                      {experienceData.challenge}
                    </p>
                  </div>
                )}

                {/* Solution Section */}
                {experienceData.solution && (
                  <div className="space-y-3 px-4">
                    <h2
                      className="font-bold flex text-[18px] items-center text-left lg:text-left"
                      style={{
                        fontFamily: 'var(--font-fira-sans)',
                      }}
                    >
                      <span className="w-8 h-8 bg-green rounded-full flex items-center justify-center mr-3 text-white">
                        3
                      </span>
                      Our Solution
                    </h2>
                    <p
                      className="text-black text-[18px] sm:text-[14px] lg:text-[16px] font-normal leading-relaxed ml-11 text-left lg:text-left"
                      style={{ fontFamily: 'var(--font-lato)' }}
                    >
                      {experienceData.solution}
                    </p>
                  </div>
                )}

                {/* Methodology Section */}
                {experienceData.methodology && (
                  <div className="space-y-4 px-4">
                    <h2
                      className="font-bold flex text-[18px] items-center text-left lg:text-left"
                      style={{
                        fontFamily: 'var(--font-fira-sans)',
                      }}
                    >
                      <span className="w-8 h-8 bg-green rounded-full flex items-center justify-center mr-3 text-white">
                        4
                      </span>
                      Methodology
                    </h2>
                    {experienceData.methodology.title && (
                      <p
                        className="text-black text-[18px] sm:text-[14px] lg:text-[16px] font-normal leading-relaxed ml-11 text-left lg:text-left"
                        style={{ fontFamily: 'var(--font-lato)' }}
                      >
                        {experienceData.methodology.title}
                      </p>
                    )}
                    <div className="ml-11 space-y-4">
                      {methodologyPhases.map((phase, index) => (
                        <div
                          key={phase.number || index}
                          className="pl-2 pb-4 text-[18px]"
                        >
                          <h3
                            className="font-bold inline-block mb-2 uppercase text-green border-b-2 border-green"
                            style={{ fontFamily: 'var(--font-lato)' }}
                          >
                            Phase {phase.number}
                          </h3>

                          <p
                            className="my-1 font-bold"
                            style={{ fontFamily: 'var(--font-lato)' }}
                          >
                            {phase.title}
                          </p>

                          <p
                            className="text-black border-l-2 border-green text-[18px] sm:text-[13px] lg:text-[15px] font-normal leading-relaxed ml-6 text-left lg:text-left px-3 my-1"
                            style={{ fontFamily: 'var(--font-lato)' }}
                          >
                            {phase.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Impact Section */}
                {experienceData.impact && (
                  <div className="space-y-4 px-4">
                    <h2
                      className="font-bold flex items-center text-[18px] text-left lg:text-left"
                      style={{
                        fontFamily: 'var(--font-fira-sans)',
                      }}
                    >
                      <span className="w-8 h-8 bg-green rounded-full flex items-center justify-center mr-3 text-white">
                        5
                      </span>
                      Impact
                    </h2>
                    {experienceData.impact.title && (
                      <p
                        className="text-black text-[18px] sm:text-[13px] lg:text-[15px] font-bold leading-relaxed ml-11 text-left lg:text-left"
                        style={{ fontFamily: 'var(--font-lato)' }}
                      >
                        {experienceData.impact.title}
                      </p>
                    )}
                    <div className="ml-11 space-y-2">
                      {impactResults.map((result, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-2 justify-start lg:justify-start"
                        >
                          <span className="w-2 h-2 bg-green rounded-full mt-2 flex-shrink-0"></span>
                          <p
                            className="text-black text-[18px] sm:text-[13px] lg:text-[15px] font-normal leading-relaxed text-left lg:text-left"
                            style={{ fontFamily: 'var(--font-lato)' }}
                          >
                            {result}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Takeaway Section */}
                {experienceData.takeaway && (
                  <div className="space-y-3 p-4 rounded-lg px-4">
                    <h2
                      className="font-bold flex items-center text-left text-[18px] lg:text-left"
                      style={{
                        fontFamily: 'var(--font-fira-sans)',
                      }}
                    >
                      <span className="w-8 h-8 bg-green text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        6
                      </span>
                      Key Takeaway
                    </h2>
                    <p
                      className="text-black text-[18px] sm:text-[13px] lg:text-[15px] font-normal leading-relaxed text-left lg:text-left ml-11"
                      style={{ fontFamily: 'var(--font-lato)' }}
                    >
                      {experienceData.takeaway}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Section - Outside main content container for full width */}
            {(ctaData.description || ctaData.subtitle) && (
              <div className="py-14 bg-gray-200 px-4 sm:px-8 lg:px-20 xl:px-32 flex flex-col justify-center items-center">
                {ctaData.description && (
                  <>
                    <h3
                      className="text-[18px] text-[#3a113d] break-words text-center  leading-relaxed"
                      style={{ fontFamily: 'var(--font-lato)' }}
                    >
                      {ctaData.description}
                    </h3>
                    <h3
                      className="text-[18px] text-[#3a113d] font-bold mb-5 break-words text-center  leading-relaxed"
                      style={{ fontFamily: 'var(--font-lato)' }}
                    >
                      {ctaData.title}
                    </h3>
                  </>
                )}
                {ctaData.buttonText && (
                  <button
                    className="bg-green text-white px-6 mb-8 py-2 font-bold text-[24px] mx-auto text-center cursor-pointer"
                    style={{ fontFamily: 'var(--font-fira-sans)' }}
                    onClick={scrollToFooter}
                  >
                    {ctaData?.buttonText || 'Get Started'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImpactStory