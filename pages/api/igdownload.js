// pages/api/igdownload.js
import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url" });

  // Daftar API cadangan (bisa ditambah kalau mau)
  const apis = [
    (u) => `https://snapinsta.app/api?url=${encodeURIComponent(u)}`,
    (u) => `https://saveig.app/api?url=${encodeURIComponent(u)}`,
    (u) => `https://downloadgram.org/api?url=${encodeURIComponent(u)}`,
  ];

  let lastError = null;

  for (let i = 0; i < apis.length; i++) {
    const apiUrl = apis[i](url);
    try {
      const response = await axios.get(apiUrl, { timeout: 8000 });

      // cek apakah respons ada data media
      if (response.data && (response.data.media || response.data.result)) {
        return res.status(200).json({
          source: apiUrl,
          results: response.data.media || response.data.result,
        });
      }
    } catch (err) {
      lastError = err;
      console.warn(`API ${i + 1} gagal:`, err.message);
      continue; // coba API berikutnya
    }
  }

  return res.status(500).json({
    error: "Semua API gagal dipanggil",
    detail: lastError?.message || "unknown error",
  });
}
