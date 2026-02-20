import ProductClient from './ProductClient'
import { Product } from '@/data/productsData'
import { notFound } from 'next/navigation'
import FooterWithBlogs from '@/components/FooterWithBlogs'
import { cache } from 'react'

export const revalidate = 43200


const getProductAndRelated = cache(async (slug: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const res = await fetch(`${baseUrl}/api/products/slug/${slug}`, {
      next: { revalidate: 43200
 },
    })

    const data = await res.json()

    if (!data.success || !data.data) return null

    const product = data.data as Product

    const allRes = await fetch(`${baseUrl}/api/products`, {
      next: { revalidate: 43200
 },
    })

    const allData = await allRes.json()

    const related: Product[] = allData.success
      ? (allData.data || [])
          .filter(
            (p: Product) =>
              p.category === product.category && p.id !== product.id,
          )
          .slice(0, 3)
      : []

    return { product, related }
  } catch {
    return null
  }
})

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const result = await getProductAndRelated(slug)

  if (!result) notFound()

  return (
    <>
      <ProductClient
        product={result.product}
        relatedProducts={result.related}
      />

      <div
        className="pt-16"
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
