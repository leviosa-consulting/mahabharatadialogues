import { cache } from 'react'
import { adminDB } from "@/firebase/firebaseAdmin";

interface PageSection {
  title: string;
  subtitle: string;
}

interface PageSettings {
  events: PageSection;
  products: PageSection;
  blogs: PageSection;
  about: PageSection;
}

export const getPageSettings = cache(async (): Promise<PageSettings> => {
  try {
    const [
      aboutSnap,
      blogsSnap,
      eventsSnap,
      productsSnap,
    ] = await Promise.all([
      adminDB.collection("pageSettings").doc("about-page-settings").get(),
      adminDB.collection("pageSettings").doc("blogs-page-settings").get(),
      adminDB.collection("pageSettings").doc("events-page-settings").get(),
      adminDB.collection("pageSettings").doc("products-page-settings").get(),
    ]);

    const pick = (data: FirebaseFirestore.DocumentData | undefined): PageSection => ({
      title: String(data?.title ?? ''),
      subtitle: String(data?.subtitle ?? ''),
    });

    return {
      about: pick(aboutSnap.data()),
      blogs: pick(blogsSnap.data()),
      events: pick(eventsSnap.data()),
      products: pick(productsSnap.data()),
    };
  } catch (error) {
    console.error("getPageSettings failed:", error);

    return {
      about: { title: "About", subtitle: "" },
      blogs: { title: "Blogs", subtitle: "" },
      events: { title: "Events", subtitle: "" },
      products: { title: "Products", subtitle: "" },
    };
  }
});
