import React from 'react'

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
      target="_blank"
      rel="noopener noreferrer"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
      className="inline-flex items-center justify-center py-5.5 px-16 sm:px-18 lg:px-27
                 font-bold text-[22px] sm:text-[16px] lg:text-[24px] font-merri"
    >
      {text}
    </a>
  )
}

export default CustomButton
