'use client'

import React, { useState } from 'react'
import { merri } from '@/app/fonts/merri'
import MobileNavbar from '@/components/MobileNavbar'
import MobileNavbarScroll from '@/components/MobileNavbarScroll'
import Navbar from '@/components/Navbar'
import { productsData } from '@/data/productsData'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function ProductDetails() {
  const params = useParams()
  const id = params.id as string

  const product = productsData.find((p) => p.id === id)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!product) {
    notFound()
  }

  // Get product images (use images array if available, otherwise fallback to single image)
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image]

  // Get related products (same category, different id)
  const relatedProducts = productsData
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

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
            PRODUCTS
          </h2>
          <p
            className={`${merri.className} text-[#D9D9D9] italic text-[24px] font-normal px-1`}
          >
            Discover our upcoming events and relive the memories from past
            gatherings
          </p>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="px-4 relative xl:mx-30 max-w-full overflow-x-hidden">
        <div className="grid grid-cols-12 mt-12 mb-4">
          <div className="col-start-1 lg:col-start-2 col-span-12 lg:col-span-10 border-b border-[#1D5C75] mb-10">
            {/* Back to Products Link and Cart */}
            <div className="flex justify-between items-center pb-4">
              <Link
                href="/products"
                className={`${merri.className} text-[#78B0C7] font-normal text-[16px] hover:underline`}
              >
                Back to Products
              </Link>
              <img src="/cart.png" alt="cart" className="w-8 md:w-10" />
            </div>
          </div>

          {/* Main Product Section */}
          <div className="mb-10 col-start-1 lg:col-start-3 col-span-12 lg:col-span-8">
            {/* Image Carousel */}
            <div className="mb-6">
              <div className="w-full  mx-auto">
                <img
                  src={productImages[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-60 md:h-112 object-cover"
                />

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
              {/* Left: Title and Description */}
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

              {/* Right: Price and Add to Bag */}
              <div className="flex flex-col items-end mt-6 md:mt-0 w-[160px]">
                {/* PRICE */}
                <div
                  className={`${merri.className} w-full italic font-extrabold text-[28px] bg-[#78B0C74D] text-[#1D5C75] px-4 py-3 flex items-baseline justify-center gap-1`}
                >
                  <span className="text-[20px]">₹</span>
                  {product.price}
                </div>

                {/* BUTTON */}
                <button
                  className={`${merri.className} w-full  font-bold text-[14px] md:text-[16px] py-2 bg-[#D12127] text-white`}
                >
                  ADD TO BAG
                </button>
              </div>
            </div>
          </div>

          <div className="col-start-1 lg:col-start-2 col-span-12 lg:col-span-10 border-b border-[#1D5C75] mb-10"></div>
          {/* Related Products Section */}
          <div className="mb-10 col-start-1 lg:col-start-3 col-span-12 lg:col-span-8">
            {relatedProducts.length > 0 && (
              <div className="mb-10  pt-10">
                <h3
                  className={`${merri.className} text-[#78B0C7] font-bold text-[18px] md:text-[20px] mb-6 uppercase`}
                >
                  MORE PRODUCTS FROM US
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
                  {relatedProducts.map((relatedProduct) => (
                    <Link
                      key={relatedProduct.id}
                      href={`/products/${relatedProduct.id}`}
                    >
                      <div className="cursor-pointer transition-shadow h-full flex flex-col">
                        {/* Product Image */}
                        <div className="w-full h-52 overflow-hidden flex items-center justify-center">
                          <img
                            src={relatedProduct.image}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex my-2 justify-between">
                          <div className="">
                            <h4
                              className={`${merri.className} leading-tight text-[#1D5C75] font-bold text-[18px] italic`}
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
                            className={`${merri.className} italic font-extrabold text-[28px] bg-[#78B0C74D] text-[#1D5C75]  flex items-center px-2 gap-1`}
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

      <div
        className="w-full relative"
        style={{
          backgroundImage: `
      linear-gradient(#1D5C75CC, #1D5C75CC),
      url('/MD-Texture_BG_Blue-01-04.png')
    `,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}
      >
        <Footer />
      </div>
    </div>
  )
}
