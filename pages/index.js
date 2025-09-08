import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleDownload = async () => {
    if (!url.trim()) {
      setError("URL tidak boleh kosong.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`/api/igdownload?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error("Gagal mengambil data.");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Terjadi kesalahan saat memproses link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img src="/logo-ig.png" alt="Logo" className="h-14" />
      </div>

      {/* Title */}
      <h1>InstaLoad BY RAFZ</h1>
      <p className="text-center text-gray-600 mb-6">
        Instagram Video, Reels & Stories Downloader
      </p>

      {/* Input */}
      <input
        type="text"
        placeholder="Tempelkan URL Instagram di sini..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handleDownload} disabled={loading}>
        {loading ? "Memproses..." : "Download"}
      </button>

      {/* Error */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {/* Hasil */}
      {result && (
        <div className="mt-6">
          {/* Info konten */}
          <div className="text-center mb-2">
            <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-sm">
              {result.type === "story"
                ? "📖 Story"
                : result.type === "reels"
                ? "🎬 Reels"
                : "📷 Postingan"}
            </span>
          </div>

          {/* Foto multiple */}
          {result.images && result.images.length > 0 && (
            <div className="overflow-x-auto flex space-x-4 p-2">
              {result.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`image-${idx}`}
                  className="rounded-lg shadow-md w-64 flex-shrink-0"
                />
              ))}
            </div>
          )}

          {/* Video */}
          {result.videos && result.videos.length > 0 && (
            <div className="mt-4">
              {result.videos.map((vid, idx) => (
                <video
                  key={idx}
                  controls
                  className="mt-3 rounded-lg shadow-md w-full"
                  src={vid}
                />
              ))}
            </div>
          )}

          {/* Audio */}
          {result.audio && (
            <div className="mt-4 text-center">
              <a
                href={result.audio}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg"
              >
                🎵 Download Audio
              </a>
            </div>
          )}

          {/* Caption */}
          {result.caption && (
            <p className="mt-4 text-center text-gray-800 italic">
              “{result.caption}”
            </p>
          )}
        </div>
      )}

      {/* Produk lain */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">🔥 Coba produk kami yang lain:</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <a
              href="https://tikload.vercel.app"
              className="text-purple-600 font-semibold hover:underline"
            >
              🎵 TikLoad – TikTok Downloader
            </a>
          </li>
          <li>
            <span className="text-gray-700">
              📷 InstaLoad – Instagram Downloader (Anda di sini)
            </span>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="footer">
        <p className="mt-6">
          Made with ❤️ by <span className="font-semibold">RAFZ</span>
        </p>
        <a
          href="https://whatsapp.com/channel/0029Vb6dhS29RZAV6wpMYj3W"
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-2"
        >
          📢 Saluran WhatsApp Kami
        </a>
      </div>
    </div>
  );
}
