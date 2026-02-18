

import FooterWithBlogsClient from "./FooterWithBlogsClient";
import { getBlogs } from "@/lib/data/blogs";
import { getLatestVideos } from "@/lib/youtube";

export default async function FooterWithBlogs({ count = 2 }) {
  const [blogs, videos] = await Promise.all([
    getBlogs(),
    getLatestVideos(),
  ]);

  return (
    <FooterWithBlogsClient
      blogs={blogs || []}
      videos={videos || []}
      count={count}
    />
  );
}