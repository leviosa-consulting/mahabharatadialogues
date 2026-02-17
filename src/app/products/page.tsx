import FooterWithBlogs from '@/components/FooterWithBlogs'
import { ProductsClient } from './ProductsClient.tsx'

export default function Page() {
  return (
    <>
      <ProductsClient initialProducts={[]} />
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
