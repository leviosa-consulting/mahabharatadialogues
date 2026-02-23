'use client'

import React, { useState, useEffect } from 'react'
import { merri } from '@/app/fonts/merri'
import MobileNavbar from '@/components/MobileNavbar'
import MobileNavbarScroll from '@/components/MobileNavbarScroll'
import Navbar from '@/components/Navbar'
import { Product } from '@/data/productsData'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { ArrowLeft } from 'lucide-react'

import { usePageSettingsStore } from '@/store/usePageSettingsStore'

interface Props {
  product: Product
  relatedProducts: Product[]
}

export default function ProductClient({ product, relatedProducts }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const settings = usePageSettingsStore((state) => state.settings)

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image]

  
  useEffect(() => {
    if (productImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === productImages.length - 1 ? 0 : prev + 1,
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [productImages.length])

  return (
    <div className="overflow-x-hidden">
      {/* nav */}
      <div>
        <MobileNavbar textColor="#1D5C75" isNotHome />
        <MobileNavbarScroll textColor="#1D5C75" showOnScrollUp={true} />
      </div>
      <div className="hidden sm:block relative pt-5 z-10">
        <Navbar textColor="#1D5C75" isNotHome />
      </div>

      {/* first section */}
      <div
        className="w-full relative pb-10 -mt-7 md:-mt-10 xl:-mt-8"
        style={{
          backgroundImage: `
      linear-gradient(#1D5C75CC, #1D5C75CC),
      url('/MD-Texture_BG_Blue-01-04.png')
    `,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}
      >
        <div className="max-w-xl mx-auto py-28 flex flex-col justify-center items-center text-center">
          <h2
            className={`${merri.className} text-white uppercase text-[24px] font-extrabold`}
          >
            {settings?.products.title}
          </h2>
          <p
            className={`${merri.className} text-[#D9D9D9] italic text-[24px] font-normal px-1`}
          >
            {settings?.products.subtitle}
          </p>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="px-4 relative xl:mx-30 max-w-full overflow-x-hidden">
        <div className="grid grid-cols-12 mt-12 mb-4">
          <div className="col-start-1 lg:col-start-2 col-span-12 lg:col-span-10 border-b border-[#1D5C75] mb-10">
            <div className="flex justify-between items-center pb-4">
              <Link
                href="/products"
                className={`${merri.className} text-[#78B0C7] flex items-center gap-2 font-normal text-[16px] hover:underline`}
              >
                <ArrowLeft size={20} />
                <span>Back to Products</span>
              </Link>
            </div>
          </div>

          {/* Main Product Section */}
          <div className="mb-10 col-start-1 lg:col-start-3 col-span-12 lg:col-span-8">
            {/* Image Carousel */}
            <div className="mb-6">
              <div className="w-full mx-auto">
                <div className="w-full flex justify-center bg-gray-100">
                  <img
                    src={productImages[currentImageIndex]}
                    alt={product.name}
                    className="w-full max-h-[350px] md:max-h-[450px] object-contain transition-opacity duration-500"
                  />
                </div>

                {/* Carousel Dots */}
                <div className="flex justify-center md:justify-start gap-3.5 mt-4">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        currentImageIndex === index
                          ? 'bg-[#1D5C75]'
                          : 'bg-[#D9D9D9]'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col md:flex-row justify-between mx-auto items-center md:items-start">
              <div className="flex-1">
                <h1
                  className={`${merri.className} text-[#1D5C75] text-center md:text-start font-bold text-[32px] md:text-[36px] italic leading-tight mb-2`}
                >
                  {product.name}
                </h1>
                <p
                  className={`${merri.className} text-[#1D5C75] text-center md:text-start font-normal text-[14px] md:text-[16px] mb-4`}
                >
                  {product.author}
                </p>
                <p
                  className={`${merri.className} text-black font-light text-center md:text-start italic md:max-w-[80%] text-[14px] md:text-[16px] leading-relaxed`}
                >
                  {product.description}
                </p>
              </div>

              <div className="flex flex-col items-end mt-6 md:mt-0 w-[160px]">
                <div
                  className={`${merri.className} w-full italic font-extrabold text-[32px] md:text-[36px] bg-[#78B0C74D] text-[#1D5C75] px-4 py-3 flex items-baseline justify-center gap-1`}
                >
                  <span className="text-[20px]">₹</span>
                  {product.price}
                </div>
                <Link
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span
                    className={`${merri.className}  w-[160px] font-bold text-[14px] md:text-[16px] py-2 bg-[#D12127] text-white flex items-center justify-center cursor-pointer`}
                  >
                    GO TO SHOP
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-start-1 lg:col-start-2 col-span-12 lg:col-span-10 border-b border-[#1D5C75] mb-10"></div>

          {/* Related Products */}
          <div className="mb-10 col-start-1 lg:col-start-3 col-span-12 lg:col-span-8">
            {relatedProducts.length > 0 && (
              <div className="mb-10 pt-10">
                <h3
                  className={`${merri.className} text-[#78B0C7] font-bold text-[16px] md:text-[18px] mb-6 uppercase`}
                >
                  MORE PRODUCTS FROM US
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
                  {relatedProducts.map((relatedProduct) => (
                    <Link
                      key={relatedProduct.id}
                      href={`/products/${relatedProduct.slug}`}
                    >
                      <div className="cursor-pointer transition-shadow h-full flex flex-col">
                        <div className="w-full h-52 overflow-hidden flex items-center justify-center">
                          <img
                            src={relatedProduct.image}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex my-2 justify-between">
                          <div>
                            <h4
                              className={`${merri.className} leading-tight text-[#1D5C75] font-bold text-[20px]  italic`}
                            >
                              {relatedProduct.name}
                            </h4>
                            <p
                              className={`${merri.className} text-[#1D5C75] font-normal text-[14px]`}
                            >
                              {relatedProduct.author}
                            </p>
                          </div>
                          <div
                            className={`${merri.className} italic font-extrabold text-[20px]  bg-[#78B0C74D] text-[#1D5C75] flex items-center px-2 gap-1`}
                          >
                            <span className="text-[20px]">₹</span>
                            {relatedProduct.price}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
