// app/products/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { merri } from '../fonts/merri'
import MobileNavbar from '@/components/MobileNavbar'
import MobileNavbarScroll from '@/components/MobileNavbarScroll'
import Navbar from '@/components/Navbar'
import CustomButton from '@/components/CustomButton'
import { usePageSettingsStore } from '@/store/usePageSettingsStore'
import { Product } from '@/data/productsData'
import Footer from '@/components/Footer'
import NavbarScroll from '@/components/NavbarScroll'


interface Props {
  initialProducts: Product[];
}

// Shimmer component
const Shimmer = () => (
  <div className="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]" />
)

// Product skeleton loader
const ProductSkeleton = () => (
  <div className="flex flex-col md:flex-row md:items-stretch py-10 border-b border-[#1D5C75]">
    {/* LEFT IMAGE SKELETON */}
    <div className="bg-[#D9D9D9E5] relative flex-shrink-0 w-full md:w-[320px] h-[320px] overflow-hidden">
      <Shimmer />
      {/* TOP RIGHT BADGE SKELETON */}
      <div className="absolute top-3 right-1 w-20 h-8 bg-gray-300 animate-pulse" />
    </div>

    {/* RIGHT CONTENT SKELETON */}
    <div className="flex flex-col gap-2 px-2 py-2 md:pl-6 md:px-0 md:py-0 flex-1">
      <div className="flex justify-between">
        <div className="flex-1">
          {/* Title skeleton */}
          <div className="h-10 bg-gray-300 rounded w-3/4 mb-2 animate-pulse" />
          {/* Author skeleton */}
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-1 animate-pulse" />
        </div>
        {/* Price skeleton */}
        <div className="max-w-[100px] h-16 bg-gray-300 animate-pulse" />
      </div>

      {/* Description skeleton */}
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
      </div>

      {/* Buttons skeleton */}
      <div className="flex flex-col md:flex-row gap-2 w-full mt-4">
        <div className="flex-1 h-12 bg-gray-300 rounded animate-pulse" />
        <div className="flex-1 h-12 bg-gray-300 rounded animate-pulse" />
      </div>
    </div>
  </div>
)

export const ProductsClient = ({ initialProducts }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'All' | 'Books' | 'Games'
  >('All')
 const [products] = useState<Product[]>(initialProducts)


  const settings = usePageSettingsStore((state) => state.settings)

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category === selectedCategory)

  // console.log('products => ', products)
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
      <NavbarScroll textColor="#1D5C75" />

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
            className={`${merri.className} text-[#D9D9D9] italic text-[24px] font-light px-1`}
          >
            {settings?.products.subtitle}
          </p>
        </div>
      </div>

      {/* below first section */}
      <div className="px-4 relative xl:mx-30 max-w-full overflow-x-hidden">
        <div className="grid grid-cols-12 gap-0 md:gap-8 mt-12 mb-4">
          <div className="col-start-1 lg:col-start-2 col-span-12 lg:col-span-10 ">
            <div className="pb-4 border-b border-[#1D5C75]">
              <h2
                className={`${merri.className} text-[#78B0C7] font-bold text-[18px] md:text-[20px]`}
              >
                { (
                  <>
                    Showing {filteredProducts.length} of {products.length}{' '}
                    {products.length > 1 ? 'products' : 'product'}
                  </>
                )}
              </h2>

              <div className="mt-3 grid grid-cols-2 gap-3 md:flex md:justify-between">
                {/* BUTTONS */}
                <div className="contents md:flex md:gap-4">
                  {/* All */}
                  <button
                    onClick={() => setSelectedCategory('All')}
                    
                    className={`${merri.className} font-bold text-[14px] md:text-[16px] px-6 md:px-16 py-2 ${
                      selectedCategory === 'All'
                        ? 'bg-[#1D5C75] text-white'
                        : 'bg-[#78B0C7] text-[#1D5C75]'}
                    `} 
                  >
                    All
                  </button>

                  {/* Games */}
                  <button
                    onClick={() => setSelectedCategory('Games')}
                  
                    className={`${merri.className} font-bold text-[14px] md:text-[16px] px-6 md:px-16 py-2 ${
                      selectedCategory === 'Games'
                        ? 'bg-[#1D5C75] text-white'
                        : 'bg-[#78B0C7] text-[#1D5C75]'
                    } `}
                  >
                    Games
                  </button>

                  {/* Books (forces second row, left) */}
                  <button
                    onClick={() => setSelectedCategory('Books')}
                  
                    className={`${merri.className} col-start-1 font-bold text-[14px] md:text-[16px] px-6 md:px-16 py-2 ${
                      selectedCategory === 'Books'
                        ? 'bg-[#1D5C75] text-white'
                        : 'bg-[#78B0C7] text-[#1D5C75]'
                    }`}
                  >
                    Books
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-start-1 lg:col-start-2 col-span-12 lg:col-span-10">
            {/* products list */}
            <div className="col-start-1 lg:col-start-2 col-span-12 lg:col-span-10">
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <h2
                    className={`${merri.className} text-[#1D5C75] text-[28px] md:text-[32px] italic font-bold`}
                  >
                    No Products Found
                  </h2>
                  <p
                    className={`${merri.className} text-[16px] md:text-[18px] text-gray-600 mt-4 max-w-[500px]`}
                  >
                    We couldn't find any products matching your selected filter.
                    Try changing the category.
                  </p>
                </div>
              ) : (
                filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`flex flex-col md:flex-row md:items-stretch py-10 ${
                      index !== filteredProducts.length - 1
                        ? 'border-b border-[#1D5C75]'
                        : ''
                    }`}
                  >
                    {/* LEFT IMAGE */}
                    <div className="bg-[#D9D9D9E5] relative flex-shrink-0 w-full md:w-[320px] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover px-4"
                      />

                      {/* TOP RIGHT BADGE */}
                      <button
                        className={`${merri.className} absolute top-3 right-1 font-bold text-[14px] md:text-[16px] px-4 md:px-6 py-1 bg-[#78B0C7] text-white`}
                      >
                        {product.category}
                      </button>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="flex flex-col gap-2 px-2 py-2 md:pl-6 md:px-0 md:py-0 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h2
                            className={`${merri.className} text-[#1D5C75] font-bold text-[32px] italic leading-tight mb-2`}
                          >
                            {product.name}
                          </h2>

                          <p
                            className={`${merri.className} text-[#1D5C75] text-[14px] md:text-[16px] mb-1`}
                          >
                            {product.author}
                          </p>
                        </div>

                        <h2
                          className={`${merri.className} max-w-[100px] italic font-extrabold text-[24px] bg-[#78B0C74D] text-[#1D5C75] p-3 flex items-center gap-1`}
                        >
                          <span className="text-[18px]">₹</span>
                          {product.price}
                        </h2>
                      </div>

                      <p
                        className={`${merri.className} text-black font-light italic md:w-[80%] text-[16px] md:text-[18px] mt-4`}
                      >
                        {product.description}
                      </p>

                      <div className="flex flex-col md:flex-row gap-2 w-full mt-4">
                        <div className="flex-1">
                          <CustomButton
                            text="MORE DETAILS"
                            bgColor="#1D5C75"
                            textColor="#FFFFFF"
                            url={`/products/${product.slug}`}
                          />
                        </div>

                        <div className="flex-1">
                          <CustomButton
                            text="GO TO SHOP"
                            bgColor="#D12127"
                            textColor="#FFFFFF"
                            isArrow
                            isOutSideLink
                            url={product.productUrl}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

     
    </div>
  )
}

