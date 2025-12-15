import Link from "next/link";
import React from "react";
import clsx from "clsx";

interface NavbarProps {
  currentTab: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentTab }) => {
  return (
    <nav className="w-full border-b bg-white/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-10 py-4">

        {/* Events */}
        <Link href="/admin/events">
          <span
            className={clsx(
              "text-lg font-semibold cursor-pointer transition-all duration-200 px-3 py-1 rounded-md",
              currentTab === "events"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-700 hover:text-purple-600"
            )}
          >
            Events
          </span>
        </Link>

        {/* Blogs */}
        <Link href="/admin/blogs">
          <span
            className={clsx(
              "text-lg font-semibold cursor-pointer transition-all duration-200 px-3 py-1 rounded-md",
              currentTab === "blogs"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-700 hover:text-purple-600"
            )}
          >
            Blogs
          </span>
        </Link>

        {/* Testimonials */}
        <Link href="/admin/testimonials">
          <span
            className={clsx(
              "text-lg font-semibold cursor-pointer transition-all duration-200 px-3 py-1 rounded-md",
              currentTab === "testimonials"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-700 hover:text-purple-600"
            )}
          >
            Testimonials
          </span>
        </Link>

      </div>
    </nav>
  );
};

export default Navbar;
