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
      
      rel="noopener noreferrer"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        width: 'min(449.73px, 90vw)',
        height: 'clamp(64px, 10vw, 80px)',
      }}
      className="
        inline-flex items-center justify-center
        font-bold font-merri
        text-[16px] sm:text-[18px]
        rounded-none
      "
    >
      {text}
    </a>
  )
}

export default CustomButton
