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

    return {
      about: aboutSnap.data() as PageSection,
      blogs: blogsSnap.data() as PageSection,
      events: eventsSnap.data() as PageSection,
      products: productsSnap.data() as PageSection,
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
