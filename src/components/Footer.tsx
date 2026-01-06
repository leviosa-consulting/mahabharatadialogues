import React from 'react'

const Footer = () => {
  return (
    <>
      <div
        className="
    flex flex-col justify-center items-center
    text-white font-bold font-neco
  py-16
    text-[18px] sm:text-[22px] md:text-[32px]
    px-4
    text-center
  "
      >
        <p className="break-all sm:break-normal">
          mahabharatadialogues@gmail.com
        </p>

        <p className="mt-2">+91 00000 00000</p>

        <div className="flex gap-3 mt-4">
          <div className="w-8 h-8 bg-[#D9D9D9]"></div>
          <div className="w-8 h-8 bg-[#D9D9D9]"></div>
          <div className="w-8 h-8 bg-[#D9D9D9]"></div>
        </div>
      </div>
    </>
  )
}

export default Footer
