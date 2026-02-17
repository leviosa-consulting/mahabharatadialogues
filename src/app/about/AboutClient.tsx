'use client'

import { useState, useEffect } from 'react'
import MobileNavbar from '@/components/MobileNavbar'
import MobileNavbarScroll from '@/components/MobileNavbarScroll'
import Navbar from '@/components/Navbar'
import NavbarScroll from '@/components/NavbarScroll'
import { merri } from '../fonts/merri'
import CustomButton from '@/components/CustomButton'
import Footer from '@/components/Footer'

import { X, Linkedin, Twitter, Instagram } from 'lucide-react'
import { usePageSettingsStore } from '@/store/usePageSettingsStore'

interface SocialLinks {
  linkedin?: string
  twitter?: string
  instagram?: string
}

interface Member {
  id: string
  name: string
  roles: string[]
  description: string
  imageUrl: string
  socialLinks?: SocialLinks
  teamType: 'core' | 'collaborators'
}

export default function AboutClient({ members: initialMembers }: { members: Member[] }) {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(initialMembers.length === 0)
  const settings = usePageSettingsStore((s) => s.settings)

<<<<<<< HEAD
  const coreTeamMembers = members.filter((m) => m.teamType === 'core')
  const collaboratorMembers = members.filter(
    (m) => m.teamType === 'collaborators',
  )
=======
  useEffect(() => {
    if (initialMembers.length === 0) {
      fetch('/api/about')
        .then(res => res.json())
        .then(data => {
          const fetched = data.data || (Array.isArray(data) ? data : [])
          setMembers(fetched)
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [])

  const coreTeamMembers = members.filter(m => m.teamType === 'core')
  const collaboratorMembers = members.filter(m => m.teamType === 'collaborators')
  
>>>>>>> 157eb12 (Convert pages and components to fetch data client-side)

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member)
  }

  const closeOverlay = () => {
    setSelectedMember(null)
  }

  return (
    <div>
      <div>
        <div>
          <MobileNavbar textColor="#1D5C75" isNotHome />
          <MobileNavbarScroll textColor="#1D5C75" showOnScrollUp={true} />
        </div>
        <div className="hidden sm:block relative pt-5 z-10">
          <Navbar textColor="#1D5C75" isNotHome />
        </div>
        <NavbarScroll textColor="#1D5C75" />
        <NavbarScroll textColor="#1D5C75" />
        <div className="mx-4 xl:mx-30 my-10">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-start-1 lg:col-start-3 col-span-12 lg:col-span-8">
              <p className="font-neco font-medium italic text-[#1D5C75] text-[20px] md:text-[28px] text-center">
                {settings?.about.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* second section */}
      <div
        style={{
          backgroundImage: `
  
    url('/MD-Texture_BG_Blue-01-04.png')
  `,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}
      >
     <div className="py-20">

  <div className="max-w-6xl mx-auto px-6">

  <div className="flex flex-col md:flex-row items-center md:justify-center gap-8 md:gap-0">

  {/* TEXT */}
 <div>
   <p
    className={`text-white ${merri.className} font-bold italic text-center md:text-left text-[20px] md:text-[24px] max-w-2xl`}
  >
    {settings?.about.subtitle}
  </p>
 </div>

  {/* BUTTON */}
  <div
    onClick={() =>
      document
        .getElementById('contact')
        ?.scrollIntoView({ behavior: 'smooth' })
    }
    className="flex w-80"
  >
    <CustomButton
      text="REACH US"
      bgColor="#1D5C75"
      textColor="#FFFFFF"
      url=""
    />
  </div>

</div>


  </div>

</div>


      </div>

      {/* CORE TEAM */}
      <div className="my-30">
        <div className="flex flex-col md:flex-row justify-center items-center my-6 ">
          <h2
            className={`${merri.className} font-bold text-[#1D5C75] text-[18px]`}
          >
            CORE TEAM
          </h2>
        </div>
        <div className="w-full">
          {collaboratorMembers.length > 0 && (
            <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center px-2 md:px-0 max-w-7xl">
              {coreTeamMembers.map((item, index) => (
                <div
                  key={index}
                  className="relative w-full max-w-[400px] h-[440px] flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handleMemberClick(item)}
                >
                  {/* Image background */}
                  <div className="absolute top-0 w-full h-[80%] md:h-[78%] bg-[#D9D9D9]/20" />

                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Bottom gradient content */}
                  <div className="w-full flex flex-col justify-center items-center absolute bottom-0 left-0 p-4 bg-gradient-to-b from-[#1D5C75] to-[#1D5C75]/50 text-center">
                    <h2
                      className={`${merri.className} italic font-extrabold text-[24px] md:text-[28px] text-white`}
                    >
                      {item.name}
                    </h2>

                    <h3
                      className={`${merri.className} font-normal text-[16px] md:text-[20px] text-white uppercase`}
                    >
                      {item.roles.join(' | ')}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* COLLABORATORS */}
      <div className="my-30">
        <div className="flex justify-center items-center my-6 ">
          <h2
            className={`${merri.className} font-bold text-[#1D5C75] text-[18px]`}
          >
            COLLABORATORS
          </h2>
        </div>
        <div className="w-full">
          {collaboratorMembers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">No collaborators found.</p>
            </div>
          ) : (
            <div className="w-full mx-auto px-2 md:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl gap-4">
              {collaboratorMembers.map((item, index) => (
                <div
                  key={index}
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handleMemberClick(item)}
                >
                  {/* IMAGE */}
                  <div className="w-full h-80 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* TEXT BELOW IMAGE */}
                  <div className="mt-2 px-1">
                    <h3
                      className={`${merri.className} font-bold text-[#1D5C75] italic text-[18px] md:text-[20px]`}
                    >
                      {item.name}
                    </h3>

                    <p
                      className={`${merri.className} text-[#1D5C75] text-[14px] md:text-[16px] uppercase`}
                    >
                      {item.roles.join(' | ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className=""
        style={{
          backgroundImage: `
    linear-gradient(#1D5C75, #1D5C75),
    url('/MD-Texture_BG_Blue-01-04.png')
  `,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}
      >
        {/* <div className="pt-16">
         <FooterBridge />
        </div> */}
      </div>

      {/* Member Detail Overlay */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeOverlay}
        >
          <div
            className="bg-white  max-w-4xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeOverlay}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Left side - Image */}
              <div className="md:w-1/3 flex-shrink-0">
                <img
                  src={selectedMember.imageUrl}
                  alt={selectedMember.name}
                  className="w-full h-64 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                />
              </div>

              {/* Right side - Content */}
              <div className="md:w-2/3 p-6 md:p-8">
                <h2
                  className={`${merri.className} font-bold italic text-[#1D5C75] text-[24px] md:text-[28px] mb-2`}
                >
                  {selectedMember.name}
                </h2>
                <p
                  className={`${merri.className} text-[#1D5C75] text-[14px] md:text-[16px] uppercase mb-4`}
                >
                  {selectedMember.roles.join(' | ')}
                </p>

                {selectedMember.description && (
                  <p className="text-gray-600 text-[14px] md:text-[16px] mb-6 leading-relaxed">
                    {selectedMember.description.split('\n').map((line, idx) => (
                      <span key={idx}>
                        {line}
                        {idx <
                          selectedMember.description.split('\n').length - 1 && (
                          <br />
                        )}
                      </span>
                    ))}
                  </p>
                )}

                {/* Social Links */}
                {selectedMember.socialLinks &&
                  (selectedMember.socialLinks.linkedin ||
                    selectedMember.socialLinks.twitter ||
                    selectedMember.socialLinks.instagram) && (
                    <div className="flex gap-4 mt-6">
                      {selectedMember.socialLinks.linkedin && (
                        <a
                          href={selectedMember.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1D5C75] hover:text-[#1D5C75]/70 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Linkedin size={24} />
                        </a>
                      )}
                      {selectedMember.socialLinks.twitter && (
                        <a
                          href={selectedMember.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1D5C75] hover:text-[#1D5C75]/70 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Twitter size={24} />
                        </a>
                      )}
                      {selectedMember.socialLinks.instagram && (
                        <a
                          href={selectedMember.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1D5C75] hover:text-[#1D5C75]/70 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Instagram size={24} />
                        </a>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
