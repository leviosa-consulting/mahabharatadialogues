// app/products/page.tsx

import FooterWithBlogs from '@/components/FooterWithBlogs'
import { ProductsClient } from './ProductsClient'
import { Product } from '@/data/productsData'
import { cache } from 'react'
import { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Products',
  description:
    'Explore producs by Mahabharata Dialogues',

  alternates: {
    canonical: 'https://mahabharatadialogues.com/products',
  },
}

const getProducts = cache(async (): Promise<Product[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/products`,
<<<<<<< HEAD
      { cache: 'no-store', signal: AbortSignal.timeout(8000) },
=======
      {
        next: { revalidate: 43200 },
        signal: AbortSignal.timeout(8000),
      },
>>>>>>> 137802a (Update project dependencies and improve data fetching reliability)
    )

    const data = await res.json()

    if (data.success) return data.data || []

    return []
  } catch {
    return []
  }
})

export default async function Page() {
  const products = await getProducts()

  return (
    <>
      <ProductsClient initialProducts={products} />
      <div
        className="w-full relative pt-16"
        style={{
          backgroundImage: `
      linear-gradient(#1D5C75CC, #1D5C75CC),
      url('/MD-Texture_BG_Blue-01-04.png')
    `,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}
      >
        <FooterWithBlogs />
      </div>
    </>
  )
}
