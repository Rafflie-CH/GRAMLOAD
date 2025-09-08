// pages/index.js
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (!url) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/igdownload?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Gagal mengambil data");
      }

      setResult(data.results || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerDownload = async (fileUrl, filename) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (e) {
      alert("Gagal mengunduh file.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 flex flex-col items-center text-white">
      <Head>
        <title>IGLoad by RAFZ - Instagram Downloader</title>
        <meta
          name="description"
          content="Download Reels, Story, dan Post Instagram gratis tanpa login."
        />
      </Head>

      {/* Header */}
      <header className="text-center py-6">
        <h1 className="text-4xl font-extrabold">IGLoad by RAFZ</h1>
        <p className="mt-2">Download Instagram Reels, Stories, dan Post dengan mudah</p>
      </header>

      {/* Input */}
      <main className="flex flex-col items-center w-full max-w-xl px-4">
        <div className="flex w-full gap-2">
          <input
            type="text"
            placeholder="Tempel link Instagram..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 p-3 rounded-xl text-black"
          />
          <button
            onClick={handleDownload}
            disabled={loading}
            className="bg-pink-600 hover:bg-pink-700 px-4 py-3 rounded-xl font-bold"
          >
            {loading ? "Loading..." : "Download"}
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-300 mt-4">{error}</p>}

        {/* Preview */}
        {result && (
          <div className="mt-6 bg-white text-black p-4 rounded-2xl w-full">
            <h2 className="font-bold text-lg text-center mb-4">Hasil</h2>

            {/* Judul & tipe posting */}
            {result.title && (
              <p className="text-center font-semibold">📌 {result.title}</p>
            )}
            {result.type && (
              <p className="text-center text-sm text-gray-600">
                Jenis: {result.type}
              </p>
            )}

            {/* Foto (carousel jika banyak) */}
            {result.images?.length > 0 && (
              <div className="mt-4 space-y-2">
                {result.images.map((img, i) => (
                  <Image
                    key={i}
                    src={img}
                    alt={`foto-${i}`}
                    width={600}
                    height={400}
                    className="rounded-xl mx-auto"
                  />
                ))}
                <button
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-white font-semibold w-full"
                  onClick={() =>
                    result.images.forEach((img, i) =>
                      triggerDownload(img, `RAFZ-IGLOAD-IMG-${i + 1}.jpg`)
                    )
                  }
                >
                  Unduh Foto
                </button>
              </div>
            )}

            {/* Video */}
            {result.videos?.length > 0 && (
              <div className="mt-4 space-y-2">
                <video
                  controls
                  src={result.videos[0]}
                  className="w-full rounded-xl"
                />
                <button
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-white font-semibold w-full"
                  onClick={() =>
                    triggerDownload(result.videos[0], `RAFZ-IGLOAD-VIDEO.mp4`)
                  }
                >
                  Unduh Video
                </button>
              </div>
            )}

            {/* Audio */}
            {result.audio && (
              <div className="mt-4 space-y-2">
                <audio controls src={result.audio} className="w-full" />
                <button
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white font-semibold w-full"
                  onClick={() =>
                    triggerDownload(result.audio, `RAFZ-IGLOAD-AUDIO.mp3`)
                  }
                >
                  Unduh Audio
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-200">
        <div className="flex justify-center items-center gap-2">
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-green-300"
          >
            <Image src="/whatsapp.png" width={20} height={20} alt="wa" />
            Saluran WhatsApp
          </a>
          <span>|</span>
          <a
            href="https://www.tikwm.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-300"
          >
            <Image src="/tikwm.png" width={20} height={20} alt="tikwm" />
            TIKWM (for API)
          </a>
        </div>

        <p className="mt-2">
          Made with ❤️ by RAFZ | Coba juga produk kami yang lain 🚀
        </p>
      </footer>
    </div>
  );
}
