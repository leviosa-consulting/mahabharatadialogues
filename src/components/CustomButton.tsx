import React from 'react'
import { merri } from '@/app/fonts/merri'

interface ButtonProps {
  text: string
  bgColor: string
  textColor: string
  isArrow?: boolean
  url: string
  isOutSideLink?: boolean
}

const CustomButton = ({
  text,
  bgColor,
  textColor,
  url,
  isArrow,
  isOutSideLink
}: ButtonProps) => {
  return (
   <a
  href={url}
  target={isOutSideLink ? "_blank" : undefined}
  rel={isOutSideLink ? "noopener noreferrer" : undefined}
  style={{ backgroundColor: bgColor, color: textColor }}
  className={`
    ${merri.className}
    inline-flex items-center justify-center
    font-bold cursor-pointer
    w-full max-w-[350px]
    h-14
    px-6 sm:px-0 lg:px-12
    text-[14px] lg:text-[16px]
    leading-none
  `}
>
  <span className="flex items-center gap-2">
    {text}
    {isArrow && (
      <img
        src="/Arrow_up-right.png"
        alt="Arrow_up"
        className="w-8 h-8 shrink-0"
      />
    )}
  </span>
</a>

  )
}

export default CustomButton
