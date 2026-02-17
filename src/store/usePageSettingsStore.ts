
import { create } from "zustand";

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

interface PageSettingsStore {
  settings: PageSettings | null;
  setSettings: (settings: PageSettings) => void;
}

export const usePageSettingsStore = create<PageSettingsStore>((set) => ({
  settings: null,

  setSettings: (settings) =>
    set({
      settings,
    }),
})); 