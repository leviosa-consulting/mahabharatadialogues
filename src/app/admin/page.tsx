import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        
        {/* Blogs */}
        <Link
          href="/admin/blogs"
          className="bg-white shadow-sm border rounded-xl p-6 hover:shadow-md transition flex items-center justify-between"
        >
          <div>
            <h2 className="text-xl font-semibold">Manage Blogs</h2>
            <p className="text-gray-500 text-sm mt-1">
              Create, edit & manage all blogs.
            </p>
          </div>

          <span className="text-gray-400 text-2xl">→</span>
        </Link>

        {/* Events */}
        <Link
          href="/admin/events"
          className="bg-white shadow-sm border rounded-xl p-6 hover:shadow-md transition flex items-center justify-between"
        >
          <div>
            <h2 className="text-xl font-semibold">Manage Events</h2>
            <p className="text-gray-500 text-sm mt-1">
              Add, update & oversee events.
            </p>
          </div>

          <span className="text-gray-400 text-2xl">→</span>
        </Link>

      </div>
    </div>
  );
};

export default page;
