

import FooterWithBlogsClient from "./FooterWithBlogsClient";
import { getBlogs } from "@/lib/data/blogs";
import { getLatestVideos } from "@/lib/youtube";

export default async function FooterWithBlogs({ count = 2, showBlogs = true }) {
  const [blogs, videos] = await Promise.all([
    // Skip the Firestore round-trip when the blog column is hidden.
    showBlogs ? getBlogs() : Promise.resolve([]),
    getLatestVideos(),
  ]);

  return (
    <FooterWithBlogsClient
      blogs={blogs || []}
      videos={videos || []}
      count={count}
      showBlogs={showBlogs}
    />
  );
}