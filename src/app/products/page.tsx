// app/products/page.tsx

import FooterWithBlogs from '@/components/FooterWithBlogs'
import { ProductsClient } from './ProductsClient'
import { Product } from '@/data/productsData'
import { cache } from 'react'

export const revalidate = 43200


const getProducts = cache(async (): Promise<Product[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/products`,
<<<<<<< HEAD
      {
        next: { revalidate: 43200
 },
      },
=======
      { cache: 'no-store', signal: AbortSignal.timeout(8000) },
>>>>>>> fc2a5da (Add error handling and timeouts to server-side data fetching)
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
