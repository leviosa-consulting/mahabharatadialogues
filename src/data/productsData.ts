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
}


export const productsData: Product[] = [
  {
    id: '1',
    name: 'Kiriti & Kirata',
    author: 'Abhilash Purohit',
    price: 499,
    category: 'Books',
    image: '/abhilash.png',
    images: ['/abhilash.png', '/assets/first.png', '/assets/second.png', '/assets/third.png', '/assets/four.png'], 
    description:
      "Dive into the mystical world of Indian mythology with 'Kiriti & Kirata', part of the Heroes of Bharata series by Abhilash Purohit. This captivating tale follows Arjuna's transformative journey as he prepares for an unprecedented war.",

  },
  {
    id: '2',
    name: 'Mythological Chess Set',
    author: 'Traditional Games',
    price: 1299,
    category: 'Games',
    image: '/assets/first.png',
    images: ['/abhilash.png', '/assets/first.png', '/assets/second.png', '/assets/third.png', '/assets/four.png'],
    description:
      'A beautifully crafted chess set featuring characters from Indian mythology. Each piece is intricately designed to represent gods, warriors, and mythical creatures from ancient tales.',
  
  },
  {
    id: '3',
    name: 'The Mahabharata Chronicles',
    author: 'Dr. Ramesh Kumar',
    price: 699,
    category: 'Books',
    image: '/assets/second.png',
    images: ['/abhilash.png', '/assets/first.png', '/assets/second.png', '/assets/third.png', '/assets/four.png'],
    description:
      'An comprehensive retelling of the greatest Indian epic. This book brings together all the major stories, characters, and lessons from the Mahabharata in an accessible format.',
 
  },
  {
    id: '4',
    name: 'Ramayana Card Game',
    author: 'Mythic Games Studio',
    price: 599,
    category: 'Games',
   image: '/assets/third.png',
    images: ['/abhilash.png', '/assets/first.png', '/assets/second.png', '/assets/third.png', '/assets/four.png'],
    description:
      'An engaging card game based on the Ramayana epic. Players take on the roles of different characters and navigate through the story using strategy and cooperation.',
 
  },
  {
    id: '5',
    name: 'Gods & Goddesses Encyclopedia',
    author: 'Prof. Meera Desai',
    price: 899,
    category: 'Books',
    image: '/assets/four.png',
    images: ['/abhilash.png', '/assets/first.png', '/assets/second.png', '/assets/third.png', '/assets/four.png'],
    description:
      'A comprehensive guide to Hindu deities, their stories, symbolism, and significance. Beautifully illustrated with traditional art and modern interpretations.',
  
  },
]