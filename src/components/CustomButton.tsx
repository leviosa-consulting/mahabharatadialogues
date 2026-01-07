import React from 'react'
import { merri } from '@/app/fonts/merri'

interface ButtonProps {
  text: string
  bgColor: string
  textColor: string
  url: string
}

const CustomButton = ({ text, bgColor, textColor, url }: ButtonProps) => {
  return (
    <a
      href={url}
      rel="noopener noreferrer"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
      className={`
        ${merri.className}
        inline-flex items-center justify-center text-center
        font-bold cursor-pointer
        w-full max-w-[450px]
        px-6 sm:px-10
        py-4 sm:py-5
        text-[16px] lg:text-[18px]
        leading-tight
       wrap-break-word
      `}
    >
      {text}
    </a>
  )
}

export default CustomButton
