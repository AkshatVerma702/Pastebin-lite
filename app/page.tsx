"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState<number | "">("");
  const [maxViews, setMaxViews] = useState<number | "">("");
  const [pasteUrl, setPasteUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl ? Number(ttl) : undefined,
          max_views: maxViews ? Number(maxViews) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setPasteUrl(data.url);
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Create a Paste</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={8}
          placeholder="Paste content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
          required
        />
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="number"
            placeholder="TTL in seconds (optional)"
            value={ttl}
            onChange={(e) => setTtl(e.target.value ? Number(e.target.value) : "")}
            style={{ width: "48%", marginRight: "4%" }}
          />
          <input
            type="number"
            placeholder="Max views (optional)"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value ? Number(e.target.value) : "")}
            style={{ width: "48%" }}
          />
        </div>
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Create Paste</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {pasteUrl && (
        <p>
          Your paste URL: <a href={pasteUrl}>{pasteUrl}</a>
        </p>
      )}
    </div>
  );
}
