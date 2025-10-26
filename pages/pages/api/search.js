import axios from "axios";

export default async function handler(req, res) {
  const q = req.query.q || "";
  if (!q) return res.status(400).json({ error: "Missing q" });

  // Read keys from environment variables (set these in Vercel dashboard)
  const KEY = process.env.GOOGLE_API_KEY;
  const CX = process.env.GOOGLE_CX;
  if (!KEY || !CX) return res.status(500).json({ error: "API key not configured" });

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(KEY)}&cx=${encodeURIComponent(CX)}&q=${encodeURIComponent(q)}&num=10`;
    const r = await axios.get(url, { timeout: 10000 });
    return res.status(200).json(r.data);
  } catch (err) {
    console.error(err?.response?.data || err.message);
    return res.status(500).json({ error: "Search API failed", details: err?.response?.data || err.message });
  }
}
