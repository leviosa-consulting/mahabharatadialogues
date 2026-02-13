// store/usePageSettingsStore.ts
import { create } from 'zustand'

interface PageSettings {
  events: {
    title: string
    subtitle: string
  }
  products: {
    title: string
    subtitle: string
  }
  blogs: {
    title: string
    subtitle: string
  }
  about: {
    title: string
    subtitle: string
  }
}

interface PageSettingsStore {
  settings: PageSettings | null
  loading: boolean
  error: string | null
  fetchSettings: () => Promise<void>
}

export const usePageSettingsStore = create<PageSettingsStore>((set) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null })
    
    try {
      // Fetch all page settings in parallel
      const [eventsRes, productsRes, blogsRes, aboutRes] = await Promise.all([
        fetch('/api/events/page-settings'),
        fetch('/api/products/page-settings'),
        fetch('/api/blogs/page-settings'),
        fetch('/api/about/page-settings'),
      ])

      const [eventsData, productsData, blogsData, aboutData] = await Promise.all([
        eventsRes.json(),
        productsRes.json(),
        blogsRes.json(),
        aboutRes.json(),
      ])

      set({
        settings: {
          events: eventsData.success ? eventsData.data : { title: 'Events', subtitle: '' },
          products: productsData.success ? productsData.data : { title: 'Products', subtitle: '' },
          blogs: blogsData.success ? blogsData.data : { title: 'Blogs', subtitle: '' },
          about: aboutData.success ? aboutData.data : { title: 'About', subtitle: '' },
        },
        loading: false,
      })
    } catch (error) {
      console.error('Error fetching page settings:', error)
      set({ 
        error: 'Failed to fetch page settings',
        loading: false,
        // Set default values on error
        settings: {
          events: { title: 'Events', subtitle: 'Discover our upcoming events and relive the memories from past gatherings' },
          products: { title: 'Products', subtitle: 'Explore our collection of books and games' },
          blogs: { title: 'Blogs', subtitle: 'Read our latest articles and insights' },
          about: { title: 'Mahabharata Dialogues', subtitle: 'Think you want to take the story of Mahabharata ahead and see what is left to explore?' },
        }
      })
    }
  },
}))