import RetreatsClient from './RetreatsClient'
import { getBlogs } from '@/lib/data/blogs'

export const revalidate = 3600

export default async function Retreats() {
  const blogs = await getBlogs()

  return <RetreatsClient blogs={blogs} />
}
