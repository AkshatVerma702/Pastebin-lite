"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState<number | "">("");
  const [maxViews, setMaxViews] = useState<number | "">("");
  const [pasteUrl, setPasteUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPasteUrl(null);
    setLoading(true);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl !== "" ? Number(ttl) : undefined,
          max_views: maxViews !== "" ? Number(maxViews) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setPasteUrl(data.url);
        setContent("");
        setTtl("");
        setMaxViews("");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Create a Paste</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          className={styles.textarea}
          rows={8}
          placeholder="Paste content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div className={styles.inputGroup}>
          <input
            type="number"
            className={styles.numberInput}
            placeholder="TTL in seconds (optional)"
            value={ttl}
            onChange={(e) =>
              setTtl(e.target.value ? Number(e.target.value) : "")
            }
          />

          <input
            type="number"
            className={styles.numberInput}
            placeholder="Max views (optional)"
            value={maxViews}
            onChange={(e) =>
              setMaxViews(e.target.value ? Number(e.target.value) : "")
            }
          />
        </div>

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Paste"}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {pasteUrl && (
        <p className={styles.url}>
          Your paste URL:{" "}
          <a href={pasteUrl} target="_blank" rel="noopener noreferrer">
            {pasteUrl}
          </a>
        </p>
      )}
    </main>
  );
}
