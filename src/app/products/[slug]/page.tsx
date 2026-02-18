// app/products/[slug]/page.tsx

import ProductClient from './ProductClient'
import { Product } from '@/data/productsData'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import FooterWithBlogs from '@/components/FooterWithBlogs'

async function getBaseUrl() {
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  return `${protocol}://${host}`
}

async function getProductAndRelated(slug: string) {
  try {
    const baseUrl = await getBaseUrl()

    const res = await fetch(`${baseUrl}/api/products/slug/${slug}`, {
      cache: 'no-store',
    })

    const data = await res.json()

    if (!data.success || !data.data) return null

    const product = data.data

    let related: Product[] = []

    try {
      const allRes = await fetch(`${baseUrl}/api/products`, {
        cache: 'no-store',
      })

      const allData = await allRes.json()

      if (allData.success) {
        related = (allData.data || [])
          .filter(
            (p: Product) =>
              p.category === product.category && p.id !== product.id,
          )
          .slice(0, 3)
      }
    } catch (e) {
      console.warn('Related fetch failed', e)
    }

    return { product, related }
  } catch (e) {
    console.error('Main product fetch failed', e)
    return null
  }
}

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
      <div className="pt-16" style={{
          backgroundImage: `
      linear-gradient(#1D5C75CC, #1D5C75CC),
      url('/MD-Texture_BG_Blue-01-04.png')
    `,
          backgroundRepeat: 'repeat',
          backgroundSize: '240px 240px',
        }}>
        <FooterWithBlogs />
      </div>
    </>
  )
}