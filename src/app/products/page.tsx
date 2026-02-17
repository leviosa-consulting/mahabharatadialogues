// app/products/page.tsx

import FooterWithBlogs from '@/components/FooterWithBlogs'
import { ProductsClient } from './ProductsClient.tsx'
import { Product } from '@/data/productsData'

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/products`,
      { cache: 'no-store' },
    )

    const data = await res.json()

    if (data.success) return data.data || []

    return []
  } catch {
    return []
  }
}

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
