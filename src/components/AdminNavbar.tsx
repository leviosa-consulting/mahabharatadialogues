import Link from "next/link";
import React from "react";
import clsx from "clsx";

interface NavbarProps {
  currentTab: string;
}

const AdminNavbar: React.FC<NavbarProps> = ({ currentTab }) => {
  return (
    <nav className="w-full border-b bg-white/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-6 items-center justify-center gap-10 py-4">

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

        {/* Retreats  */}
        <Link href="/admin/retreats">
          <span
            className={clsx(
              "text-lg font-semibold cursor-pointer transition-all duration-200 px-3 py-1 rounded-md",
              currentTab === "retreats"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-700 hover:text-purple-600"
            )}
          >
            Retreats
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
            Blog
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
        {/* Products */}
        <Link href="/admin/products">
          <span
            className={clsx(
              "text-lg font-semibold cursor-pointer transition-all duration-200 px-3 py-1 rounded-md",
              currentTab === "testimonials"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-700 hover:text-purple-600"
            )}
          >
            Products
          </span>
        </Link>
        {/* About */}
        <Link href="/admin/about">
          <span
            className={clsx(
              "text-lg font-semibold cursor-pointer transition-all duration-200 px-3 py-1 rounded-md",
              currentTab === "testimonials"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-700 hover:text-purple-600"
            )}
          >
           About Us
          </span>
        </Link>

      </div>
    </nav>
  );
};

export default AdminNavbar;
