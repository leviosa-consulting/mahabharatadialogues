import ProductClient from './ProductClient'
import { Product } from '@/data/productsData'
import { notFound } from 'next/navigation'
import FooterWithBlogs from '@/components/FooterWithBlogs'
import { cache } from 'react'
import type { Metadata } from 'next'

export const runtime = 'nodejs'
export const revalidate = 3600

const getProductAndRelated = cache(async (slug: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000'

    const res = await fetch(`${baseUrl}/api/products/slug/${slug}`, {
      next: { revalidate: 3600 },
    })

    const data = await res.json()

    if (!data.success || !data.data) return null

    const product = data.data as Product

    const allRes = await fetch(`${baseUrl}/api/products`, {
      next: { revalidate: 3600 },
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

/* ------------------ Dynamic Metadata ------------------ */

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://mahabharatadialogues.com'

  const res = await fetch(`${baseUrl}/api/products/slug/${slug}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return {
      title: 'Product Not Found | Mahabharata Dialogues',
    }
  }

  const json = await res.json()

  if (!json.success || !json.data) return {}

  const product = json.data

  const description = product.description?.substring(0, 140) || product.name

  return {
    title: `${product.name} `,
    description,

    alternates: {
      canonical: `${baseUrl}/products/${slug}`,
    },
  }
}

/* ------------------ Page ------------------ */

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
        <FooterWithBlogs showBlogs={false} />
      </div>
    </>
  )
}
