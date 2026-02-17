import FooterWithBlogsClient from "./FooterWithBlogsClient";

export default function FooterWithBlogs({ count = 2 }: { count?: number }) {
  return <FooterWithBlogsClient count={count} />;
}
