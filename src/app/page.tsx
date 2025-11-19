"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Link2,
  Copy,
  Trash2,
  BarChart3,
  Check,
  ArrowRight,
  Sparkles,
  Globe,
  Zap,
  History,
  Clock,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";

interface LinkData {
  id: number;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  lastClickedAt: string | null;
  createdAt: string;
}

export default function Home() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search & Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "clicks">("date");

  // --- Setup & Polling ---
  useEffect(() => {
    let storedId = localStorage.getItem("tinylink_user_id");
    if (!storedId) {
      storedId =
        Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem("tinylink_user_id", storedId);
    }
    setUserId(storedId);
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchLinks(userId, true);
    const intervalId = setInterval(() => fetchLinks(userId, false), 3000);
    return () => clearInterval(intervalId);
  }, [userId]);

  async function fetchLinks(uid: string, showLoading = false) {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/links", { headers: { "x-user-id": uid } });
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId },
        body: JSON.stringify({ url, shortCode: customCode || undefined }),
      });

      const data = await res.json();
      if (res.status === 409) {
        setError("That alias is taken. Try another.");
      } else if (!res.ok) {
        setError(data.error || "Error creating link.");
      } else {
        setUrl("");
        setCustomCode("");
        fetchLinks(userId, false);
      }
    } catch (err) {
      setError("Connection failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(code: string) {
    if (!confirm("Delete this link?")) return;
    setLinks(links.filter((l) => l.shortCode !== code));
    await fetch(`/api/links/${code}`, { method: "DELETE" });
    fetchLinks(userId, false);
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${code}`);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- Filter & Sort Logic ---
  const filteredLinks = links
    .filter(
      (link) =>
        link.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "clicks") return b.clicks - a.clicks;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-700 flex flex-col">
      {/* --- ANIMATED BACKGROUND --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/50 border-b border-white/40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Link2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              TinyLink
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center gap-1">
              <Globe className="w-3 h-3" /> Public Mode
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20 flex-grow w-full">
        {/* --- HERO SECTION --- */}
        <section className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            Shorten URLs, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Expand Reach.
            </span>
          </h1>

          {/* --- SEPARATED INPUTS FORM --- */}
          <div className="max-w-2xl mx-auto mt-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* 1. MAIN URL INPUT */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 flex items-center">
                  <div className="pl-5 pr-3 text-gray-400">
                    <Zap className="w-6 h-6" />
                  </div>
                  <input
                    type="url"
                    required
                    placeholder="Paste your long link here..."
                    className="w-full py-5 pr-5 bg-transparent border-none focus:ring-0 text-lg font-medium text-gray-800 placeholder-gray-400 rounded-xl"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div>

              {/* 2. SECOND ROW: ALIAS & BUTTON */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative group flex-1">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 flex items-center">
                    <div className="pl-5 pr-3 text-gray-400 text-sm font-bold tracking-wide">
                      TINYLINK/
                    </div>
                    <input
                      type="text"
                      placeholder="alias"
                      pattern="[A-Za-z0-9]{6,8}"
                      title="6-8 alphanumeric characters"
                      className="w-full py-4 pr-5 bg-transparent border-none focus:ring-0 text-base font-medium text-gray-800 placeholder-gray-400 rounded-xl"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="sm:w-auto w-full bg-gray-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/50 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Shorten <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {error && (
            <div className="mt-6 inline-flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm font-medium animate-pulse border border-red-100">
              <div className="w-2 h-2 rounded-full bg-red-500" /> {error}
            </div>
          )}
        </section>

        {/* --- TABLE SECTION --- */}
        <section className="animate-fade-in-up animation-delay-2000">
          {/* TABLE HEADER CONTROLS */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" />
              Active Links
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                {links.length}
              </span>
            </h2>

            {links.length > 0 && (
              <div className="flex items-center gap-3">
                {/* FIXED: SEARCH BAR (Increased Padding Left to pl-10) */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3  flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl- pr-4 py-2 bg-white/60 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 h-10 w-full md:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* FIXED: SORT DROPDOWN (Funnel on Left, Chevron on Right) */}
                <div className="relative h-10">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="w-4 h-4 text-gray-400" />
                  </div>
                  <select
                    className="h-full pl-10 pr-10 bg-white/60 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer appearance-none"
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "date" | "clicks")
                    }
                  >
                    <option value="date">Newest</option>
                    <option value="clicks">Most Clicks</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* MODERN TABLE */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                Loading links...
              </div>
            ) : filteredLinks.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                {searchQuery
                  ? "No matching links found."
                  : "No links created yet."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      <th className="p-5">Short Link</th>
                      <th className="p-5">Original URL</th>
                      <th className="p-5 text-center">Total Clicks</th>
                      <th className="p-5">Last Clicked</th>
                      <th className="p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLinks.map((link) => (
                      <tr
                        key={link.id}
                        className="group hover:bg-indigo-50/30 transition-colors"
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-2 font-bold text-indigo-600">
                            <Globe className="w-4 h-4 opacity-50" />
                            <a
                              href={`/${link.shortCode}`}
                              target="_blank"
                              className="hover:underline"
                            >
                              {link.shortCode}
                            </a>
                          </div>
                        </td>
                        <td className="p-5">
                          <div
                            className="text-sm text-gray-600 truncate max-w-[200px] md:max-w-xs"
                            title={link.originalUrl}
                          >
                            {link.originalUrl}
                          </div>
                        </td>

                        <td className="p-5 text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            <BarChart3 className="w-3 h-3 mr-1.5" />
                            {link.clicks}
                          </span>
                        </td>

                        <td className="p-5 text-sm text-gray-500">
                          {link.lastClickedAt ? (
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-700">
                                {new Date(
                                  link.lastClickedAt
                                ).toLocaleDateString()}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(
                                  link.lastClickedAt
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Never</span>
                          )}
                        </td>

                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleCopy(link.shortCode)}
                              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                              title="Copy"
                            >
                              {copiedId === link.shortCode ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <Link
                              href={`/code/${link.shortCode}`}
                              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                              title="Analytics"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(link.shortCode)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} TinyLink. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link
              href="/healthz"
              className="hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              <div className="w-2 h-2 rounded-full bg-green-500" />
              System Status
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
