import { useState } from "react";

export default function Home() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  async function doSearch(e) {
    e && e.preventDefault();
    if (!q || q.trim().length < 1) return;
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      setResults(json);
    } catch (err) {
      console.error(err);
      setResults({ error: "Search failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "Inter, system-ui, Arial", padding: 24, background: "#f6f8fb" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>WebHunt — Search the web for tools & sites</h1>
        <form onSubmit={doSearch} style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. free AI video generator, free games site, animation tools"
            style={{ flex: 1, padding: "12px 14px", borderRadius: 8, border: "1px solid #dbe4f0" }}
          />
          <button disabled={loading} type="submit" style={{ padding: "10px 14px", borderRadius: 8, background: "#0f172a", color: "#fff", border: "none" }}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {results && results.error && <div style={{ color: "red" }}>{results.error}</div>}

        {results && results.items && (
          <div>
            <div style={{ marginBottom: 10, color: "#475569" }}>
              Showing {results.items.length} results — <small style={{ color: "#94a3b8" }}>source: Google Custom Search</small>
            </div>

            {results.items.map((it, i) => {
              // Determine domain & risk warning
              const a = document.createElement("a");
              a.href = it.link;
              const hostname = a.hostname || it.displayLink || "";
              const risk = /crack|torrent|warez|cracked|patch|serial|keygen|unlocked/i.test(it.title + " " + it.snippet + " " + it.link);

              return (
                <div key={i} style={{ padding: 14, background: "#fff", borderRadius: 10, marginBottom: 12, boxShadow: "0 6px 18px rgba(15,23,42,0.04)" }}>
                  <a href={it.link} target="_blank" rel="noopener noreferrer" style={{ color: "#0b4ad6", fontWeight: 700, fontSize: 16 }}>{it.title}</a>
                  <div style={{ color: "#64748b", fontSize: 13 }}>{hostname}</div>
                  <p style={{ marginTop: 8, color: "#334155" }}>{it.snippet}</p>
                  {risk && (
                    <div style={{ marginTop: 8, color: "#b91c1c", fontWeight: 600 }}>
                      ⚠️ May contain piracy/risky content — we do not endorse illegal downloads.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!results && <div style={{ color: "#94a3b8" }}>Enter a search term and press Search.</div>}
      </div>
    </div>
  );
}
