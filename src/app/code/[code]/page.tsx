"use client";

import { useState, useEffect } from "react";
import {
  Link2,
  Calendar,
  BarChart3,
  ArrowLeft,
  Clock,
  Globe,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface LinkData {
  id: number;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  lastClickedAt: string | null;
  createdAt: string;
}

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const [link, setLink] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);

  // The code comes from the URL (e.g., /code/wiki12)
  const code = params.code as string;

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`/api/links/${code}`);
        if (res.ok) {
          const data = await res.json();
          setLink(data);
        } else {
          setLink(null);
        }
      } catch (error) {
        console.error("Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Link Not Found</h1>
        <button
          onClick={() => router.push("/")}
          className="text-indigo-600 hover:underline"
        >
          Go back home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-sans text-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-2">
                <span className="text-indigo-600">/{link.shortCode}</span>
              </h1>
              <a
                href={link.originalUrl}
                target="_blank"
                className="text-gray-500 break-all hover:text-indigo-600 hover:underline flex items-start gap-2"
              >
                <Link2 className="w-4 h-4 mt-1 shrink-0" />
                {link.originalUrl}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-bold text-xl flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {link.clicks} Clicks
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid (Responsive: Stack on mobile, 3 cols on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Created At */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2 text-gray-500">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">Created On</span>
            </div>
            <p className="text-lg font-semibold text-slate-800">
              {new Date(link.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Card 2: Last Click */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2 text-gray-500">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Last Clicked</span>
            </div>
            <p className="text-lg font-semibold text-slate-800">
              {link.lastClickedAt
                ? new Date(link.lastClickedAt).toLocaleString()
                : "Never"}
            </p>
          </div>

          {/* Card 3: Destination */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2 text-gray-500">
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">Destination</span>
            </div>
            <p className="text-lg font-semibold text-slate-800 truncate">
              {new URL(link.originalUrl).hostname}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
