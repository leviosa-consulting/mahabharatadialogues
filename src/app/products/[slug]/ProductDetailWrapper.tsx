'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ProductClient from './ProductClient'

export default function ProductDetailWrapper() {
  const params = useParams()
  const slug = params?.slug as string
  const [product, setProduct] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/products/slug/${slug}`)
      .then(res => res.json())
      .then(async data => {
        if (data.success && data.data) {
          setProduct(data.data)
          try {
            const allRes = await fetch('/api/products')
            const allData = await allRes.json()
            if (allData.success) {
              setRelated(
                (allData.data || [])
                  .filter((p: any) => p.category === data.data.category && p.id !== data.data.id)
                  .slice(0, 3)
              )
            }
          } catch {}
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D5C75]"></div></div>
  if (!product) return <div className="min-h-screen flex items-center justify-center text-gray-500">Product not found</div>

  return <ProductClient product={product} relatedProducts={related} />
}
