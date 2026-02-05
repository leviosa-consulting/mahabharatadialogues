'use client'

import React, { useState } from 'react'
import { merri } from '../fonts/merri'
import MobileNavbar from '@/components/MobileNavbar'
import MobileNavbarScroll from '@/components/MobileNavbarScroll'
import Navbar from '@/components/Navbar'
import CustomButton from '@/components/CustomButton'
import { productsData } from '@/data/productsData'
import { Product } from '@/data/productsData'
import Link from 'next/link'

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    'All' | 'Books' | 'Games'
  >('All')

  const filteredProducts =
    selectedCategory === 'All'
      ? productsData
      : productsData.filter((product) => product.category === selectedCategory)

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
            Discover our products
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
                Showing {filteredProducts.length} of {productsData.length}{' '}
                products
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
                        : 'bg-[#78B0C7] text-[#1D5C75]'
                    }`}
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
                    }`}
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

                {/* CART (second row right on mobile) */}
                <div className="flex justify-end items-center md:ml-auto">
                  <img src="/cart.png" alt="cart" className="w-8 md:w-10" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-start-1 lg:col-start-2 col-span-12 lg:col-span-10">
            {/* products list */}
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col md:flex-row border-b border-[#1D5C75] pb-8 my-10"
              >
                {/* left */}
                <div className="bg-[#D9D9D9E5] max-w-[434px] relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="px-10 h-full object-cover"
                  />

                  {/* TOP RIGHT BADGE */}
                  <button
                    className={`${merri.className} absolute top-3 right-3 font-bold text-[14px] md:text-[16px] px-4 md:px-6 py-1 bg-[#78B0C7] text-white`}
                  >
                    {product.category}
                  </button>
                </div>

                <div className="flex flex-col gap-2 px-2 py-2 md:pl-6 md:px-0 md:py-0">
                  {/* right */}
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h2
                        className={`${merri.className} text-[#1D5C75] font-bold text-[32px] italic leading-tight mb-2`}
                      >
                        {product.name}
                      </h2>
                      <p
                        className={`${merri.className} text-[#1D5C75] font-normal text-[14px] md:text-[16px] mb-1`}
                      >
                        {product.author}
                      </p>
                    </div>

                    <div>
                      <h2
                        className={`${merri.className} max-w-[100px] italic font-extrabold text-[24px] bg-[#78B0C74D] text-[#1D5C75] p-3 flex items-center gap-1`}
                      >
                        <span className="text-[18px]">₹</span>
                        {product.price}
                      </h2>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <p
                      className={`${merri.className} text-black font-light italic text-[16px] md:text-[18px] mt-4`}
                    >
                      {product.description}
                    </p>

                    <div className="flex gap-2 w-full">
                      <div className="flex-1">
                        <CustomButton
                          text="ADD TO CART"
                          bgColor="#D12127"
                          textColor="#FFFFFF"
                          url=""
                   
                        />
                      </div>

                      <div className="flex-1">
                        <Link
                          href={`/products/${product.id}`}
                          className="block w-full"
                        >
                          <CustomButton
                            text="MORE DETAILS"
                            bgColor="#1D5C75"
                            textColor="#FFFFFF"
                            url=""
                           
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
