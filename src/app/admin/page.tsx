"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminNavbar from "@/components/AdminNavbar";
import db from "@/firebase/firebaseServices";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

const AdminDashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRetreat = async () => {
      const retreatRef = doc(db, "retreat", "settings");
      const snap = await getDoc(retreatRef);

      if (snap.exists()) {
        const data = snap.data();

        if (data.startDate) {
          setStartDate(data.startDate.toDate().toISOString().split("T")[0]);
        }
        if (data.endDate) {
          setEndDate(data.endDate.toDate().toISOString().split("T")[0]);
        }
      }
    };

    fetchRetreat();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage("");

      await setDoc(doc(db, "retreat", "settings"), {
        startDate: Timestamp.fromDate(new Date(startDate)),
        endDate: Timestamp.fromDate(new Date(endDate)),
        updatedAt: new Date(),
      });

      setMessage("Retreat dates updated successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Error saving retreat dates.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminNavbar currentTab="admin" />

      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* CENTERED GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">

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

          {/* Retreats (NEW) */}
          <Link
            href="/admin/retreats"
            className="bg-white shadow-sm border rounded-xl p-6 hover:shadow-md transition flex items-center justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">Manage Retreats</h2>
              <p className="text-gray-500 text-sm mt-1">
                Create & manage retreat listings.
              </p>
            </div>
            <span className="text-gray-400 text-2xl">→</span>
          </Link>

          {/* Testimonials */}
          <Link
            href="/admin/testimonials"
            className="bg-white shadow-sm border rounded-xl p-6 hover:shadow-md transition flex items-center justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">Manage Testimonials</h2>
              <p className="text-gray-500 text-sm mt-1">
                Add, edit & manage testimonials.
              </p>
            </div>
            <span className="text-gray-400 text-2xl">→</span>
          </Link>

          {/* Retreat Date Range Settings */}
          <div className="bg-white hidden shadow-sm border rounded-xl p-6  gap-4 md:col-span-2">
            <h2 className="text-xl font-semibold">Update Retreat Dates</h2>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col w-full">
                <label className="text-sm text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Retreat Dates"}
            </button>

            {message && (
              <p className="text-sm text-green-600">{message}</p>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
