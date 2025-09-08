import { useState } from "react";
import Head from "next/head";
import { FaWhatsapp, FaTiktok } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleDownload = async () => {
    if (!url.trim()) {
      alert("Masukkan URL Instagram terlebih dahulu!");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) {
        alert("Gagal mengambil data: " + data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>InstaLoad BY RAFZ - Instagram Downloader</title>
        <meta
          name="description"
          content="Download video, reel, dan stories Instagram tanpa watermark dengan InstaLoad BY RAFZ. Gratis, cepat, tanpa login!"
        />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="InstaLoad BY RAFZ - Instagram Downloader" />
        <meta property="og:description" content="Download video, reel, dan stories Instagram gratis dan cepat tanpa login." />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content="https://instaload.rafzhost.xyz" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 flex flex-col items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-6 w-full max-w-lg text-center">
          {/* Logo */}
          <img src="/logo.png" alt="Logo" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">InstaLoad BY RAFZ</h1>
          <p className="text-white/80 mb-6">Instagram Video, Reels & Stories Downloader</p>

          {/* Input */}
          <input
            type="text"
            placeholder="Tempelkan URL Instagram di sini..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 mb-4"
          />

          {/* Button */}
          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg transition"
          >
            {loading ? "Memproses..." : "Download"}
          </button>

          {/* Hasil */}
          {result && (
            <div className="mt-6 bg-white/20 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-white mb-2">Hasil Download:</h2>
              {result.medias?.map((media, idx) => (
                <div key={idx} className="mb-2">
                  <a
                    href={media.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-200 underline"
                  >
                    Download {media.extension}
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Produk Lain */}
          <div className="mt-8 text-left">
            <h3 className="text-white font-semibold mb-3">🚀 Coba produk kami yang lain:</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <FaTiktok className="text-white" />
                <a
                  href="https://tikload.rafzhost.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:underline"
                >
                  TikLoad - TikTok Downloader
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <FaInstagram className="text-white" />
                <span className="text-pink-300">InstaLoad - Instagram Downloader (Anda di sini)</span>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-10">
            <p className="text-white/60 text-sm mb-3">Made with ❤️ by RAFZ</p>
            <a
              href="https://whatsapp.com/channel/0029Vb6dhS29RZAV6wpMYj3W"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
            >
              <FaWhatsapp />
              <span>Saluran WhatsApp Kami</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
