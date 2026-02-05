export interface Product {
  id: string
  name: string
  author: string
  price: number
  category: 'Books' | 'Games'
  image: string
   images?: string[] 
  description: string
  fullDescription?: string
  features?: string[]
  specifications?: {
    label: string
    value: string
  }[]
}


export const productsData: Product[] = [
  {
    id: '1',
    name: 'Kiriti & Kirata',
    author: 'Abhilash Purohith',
    price: 499,
    category: 'Books',
    image: '/abhilash.png',
    images: ['/abhilash.png', '/assets/first.png', '/assets/second.png', '/assets/third.png', '/assets/four.png'], 
    description:
      "Dive into the mystical world of Indian mythology with 'Kiriti & Kirata', part of the Heroes of Bharata series by Abhilash Purohit. This captivating tale follows Arjuna's transformative journey as he prepares for an unprecedented war.",
    fullDescription:
      "Dive into the mystical world of Indian mythology with 'Kiriti & Kirata', part of the Heroes of Bharata series by Abhilash Purohit. This captivating tale follows Arjuna's transformative journey as he prepares for an unprecedented war. Experience the epic battles, divine encounters, and the profound wisdom that shapes one of the greatest warriors in Indian mythology.",
    features: [
      'Part of the Heroes of Bharata series',
      'Rich illustrations and storytelling',
      'Explores Indian mythology in depth',
      'Perfect for mythology enthusiasts',
    ],
    specifications: [
      { label: 'Author', value: 'Abhilash Purohith' },
      { label: 'Pages', value: '320' },
      { label: 'Publisher', value: 'Mythological Publishing House' },
      { label: 'Language', value: 'English' },
      { label: 'ISBN', value: '978-1234567890' },
    ],
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
    fullDescription:
      'A beautifully crafted chess set featuring characters from Indian mythology. Each piece is intricately designed to represent gods, warriors, and mythical creatures from ancient tales. This premium set combines strategic gameplay with cultural heritage.',
    features: [
      'Handcrafted wooden pieces',
      'Mythology-themed design',
      'Premium quality board',
      'Includes storage case',
    ],
    specifications: [
      { label: 'Material', value: 'Rosewood' },
      { label: 'Board Size', value: '18" x 18"' },
      { label: 'Piece Height', value: '3" - 4"' },
      { label: 'Weight', value: '2.5 kg' },
    ],
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
    fullDescription:
      'An comprehensive retelling of the greatest Indian epic. This book brings together all the major stories, characters, and lessons from the Mahabharata in an accessible format. Perfect for both newcomers and those familiar with the epic.',
    features: [
      'Complete epic coverage',
      'Modern language adaptation',
      'Character glossary included',
      'Maps and illustrations',
    ],
    specifications: [
      { label: 'Author', value: 'Dr. Ramesh Kumar' },
      { label: 'Pages', value: '580' },
      { label: 'Publisher', value: 'Epic Tales Publishing' },
      { label: 'Language', value: 'English' },
      { label: 'ISBN', value: '978-0987654321' },
    ],
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
    fullDescription:
      'An engaging card game based on the Ramayana epic. Players take on the roles of different characters and navigate through the story using strategy and cooperation. Perfect for family game nights and teaching mythology to younger generations.',
    features: [
      '2-6 players',
      '120+ illustrated cards',
      'Multiple game modes',
      'Educational and fun',
    ],
    specifications: [
      { label: 'Players', value: '2-6' },
      { label: 'Age', value: '10+' },
      { label: 'Play Time', value: '30-45 minutes' },
      { label: 'Cards', value: '120 cards' },
    ],
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
    fullDescription:
      'A comprehensive guide to Hindu deities, their stories, symbolism, and significance. Beautifully illustrated with traditional art and modern interpretations. This encyclopedia serves as both a reference guide and a visual journey through Hindu mythology.',
    features: [
      'Over 100 deities covered',
      'Full-color illustrations',
      'Detailed mythology',
      'Hardcover edition',
    ],
    specifications: [
      { label: 'Author', value: 'Prof. Meera Desai' },
      { label: 'Pages', value: '450' },
      { label: 'Publisher', value: 'Divine Knowledge Press' },
      { label: 'Language', value: 'English' },
      { label: 'ISBN', value: '978-1122334455' },
    ],
  },
]