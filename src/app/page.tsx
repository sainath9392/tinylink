"use client";

import { useState, useEffect } from "react";

// Define the shape of our Link data
interface LinkData {
  id: number;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  lastClickedAt: string | null;
}

export default function Home() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  // 1. Initialize User ID
  useEffect(() => {
    let storedId = localStorage.getItem("tinylink_user_id");
    if (!storedId) {
      storedId =
        Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem("tinylink_user_id", storedId);
    }
    setUserId(storedId);
  }, []);

  // 2. Polling Logic: Fetch data every 2 seconds
  useEffect(() => {
    if (!userId) return;

    // Initial fetch (shows loading spinner)
    fetchLinks(userId, true);

    // Setup interval for background updates (no spinner)
    const intervalId = setInterval(() => {
      fetchLinks(userId, false);
    }, 2000); // Check every 2000ms (2 seconds)

    // Cleanup interval when user leaves page
    return () => clearInterval(intervalId);
  }, [userId]);

  // Updated fetch function: accepts 'showLoading' parameter
  async function fetchLinks(uid: string, showLoading = false) {
    if (showLoading) setLoading(true);

    try {
      const res = await fetch("/api/links", {
        headers: { "x-user-id": uid },
      });
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (err) {
      console.error("Failed to fetch links");
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
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ url, shortCode: customCode || undefined }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setError("That custom code is already taken. Please try another.");
      } else if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setUrl("");
        setCustomCode("");
        // Immediate fetch to show new link
        fetchLinks(userId, false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(code: string) {
    if (!confirm("Are you sure you want to delete this link?")) return;

    // Optimistic update: Remove it from screen immediately
    setLinks(links.filter((l) => l.shortCode !== code));

    await fetch(`/api/links/${code}`, { method: "DELETE" });
    // Background fetch to ensure sync
    fetchLinks(userId, false);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-2">
            TinyLink
          </h1>
          <p className="text-gray-600">Shorten your URLs with ease.</p>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold mb-4">Create a New Link</h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1">
              <input
                type="url"
                required
                placeholder="Paste long URL here (e.g. https://google.com)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <input
                type="text"
                placeholder="Code (optional)"
                pattern="[A-Za-z0-9]{6,8}"
                title="6-8 alphanumeric characters"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Shorten"}
            </button>
          </form>
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold">Your Links</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading links...
            </div>
          ) : links.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No links created yet. Try adding one above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="p-4">Short Code</th>
                    <th className="p-4">Original URL</th>
                    <th className="p-4 text-center">Clicks</th>
                    <th className="p-4">Last Clicked</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {links.map((link) => (
                    <tr key={link.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-blue-600">
                        <a
                          href={`/${link.shortCode}`}
                          target="_blank"
                          className="hover:underline"
                        >
                          {link.shortCode}
                        </a>
                      </td>
                      <td
                        className="p-4 text-gray-600 truncate max-w-xs"
                        title={link.originalUrl}
                      >
                        {link.originalUrl}
                      </td>
                      {/* Key changes here: The clicks update automatically */}
                      <td className="p-4 text-center font-medium bg-gray-50 rounded">
                        {link.clicks}
                      </td>
                      <td className="p-4 text-gray-500">
                        {link.lastClickedAt
                          ? new Date(link.lastClickedAt).toLocaleDateString() +
                            " " +
                            new Date(link.lastClickedAt).toLocaleTimeString()
                          : "-"}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(
                              `${window.location.origin}/${link.shortCode}`
                            )
                          }
                          className="text-gray-500 hover:text-blue-600 mr-4"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => handleDelete(link.shortCode)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
