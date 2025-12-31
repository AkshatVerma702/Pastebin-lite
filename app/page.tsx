"use client";

import { useState } from "react";
import styles from "./page.module.css";

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
    <div className={styles.container}>
      <h1>Create a Paste</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={8}
          placeholder="Paste content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <div style={{ display: "flex", marginBottom: "1rem" }}>
          <input
            type="number"
            placeholder="TTL in seconds (optional)"
            value={ttl}
            onChange={(e) => setTtl(e.target.value ? Number(e.target.value) : "")}
            style={{ flex: 1 }}
          />
          <input
            type="number"
            placeholder="Max views (optional)"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value ? Number(e.target.value) : "")}
            style={{ flex: 1, marginLeft: "4%" }}
          />
        </div>
        <button type="submit">Create Paste</button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
      {pasteUrl && (
        <p className={styles.url}>
          Your paste URL: <a href={pasteUrl}>{pasteUrl}</a>
        </p>
      )}
    </div>
  );
}
