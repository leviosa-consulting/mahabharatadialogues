export interface Product {
  id: string
  name: string
  author: string
  price: number
  category: 'Books' | 'Games'
  slug?: string
  image: string
   images?: string[] 
  description: string
  productUrl?: string
}


