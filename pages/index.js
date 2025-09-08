import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengambil data");

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (fileUrl, type, title) => {
    try {
      const res = await fetch(`/api/proxy?url=${encodeURIComponent(fileUrl)}`);
      if (!res.ok) throw new Error("Gagal mengunduh file");

      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = `RAFZ-IGLOAD-${title || "instagram"}.${type}`;
      a.click();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>IGLoad BY RAFZ (Rafflie aditya) - Instagram Downloader</title>
        <meta
          name="description"
          content="Download video, foto, dan stories Instagram gratis dan cepat dengan IGLoad BY RAFZ. 100% FREE tanpa login dan tanpa iklan!"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="IGLoad BY RAFZ - Instagram Downloader" />
        <meta
          property="og:description"
          content="Download video, foto, dan stories Instagram gratis dan cepat dengan IGLoad BY RAFZ. 100% FREE tanpa login dan tanpa iklan!"
        />
        <meta property="og:image" content="https://igload.rafzhost.xyz/logo.png" />
        <meta property="og:url" content="https://igload.rafzhost.xyz" />
        <meta property="og:type" content="website" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-white bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center drop-shadow-lg">
          IGLoad Downloader <span className="block text-lg">by RAFZ</span>
        </h1>

        <div className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6">
          <input
            type="text"
            placeholder="Tempel URL Instagram disini..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-black focus:outline-none mb-4"
          />
          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {loading ? "Mengunduh..." : "Download"}
          </button>
        </div>

        {error && <p className="mt-4 text-red-200">{error}</p>}

        {result && (
          <div className="mt-6 w-full max-w-xl bg-white/10 backdrop-blur-md rounded-xl p-4">
            {result.type === "video" && (
              <>
                <video controls className="w-full rounded-lg mb-4">
                  <source src={result.url} type="video/mp4" />
                </video>
                <button
                  onClick={() =>
                    downloadFile(result.url, "mp4", result.title || "video")
                  }
                  className="w-full py-3 bg-blue-600 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Unduh Video
                </button>
              </>
            )}

            {result.type === "image" && (
              <>
                <img
                  src={result.url}
                  alt="Instagram Media"
                  className="w-full rounded-lg mb-4"
                />
                <button
                  onClick={() =>
                    downloadFile(result.url, "jpg", result.title || "photo")
                  }
                  className="w-full py-3 bg-blue-600 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Unduh Foto
                </button>
              </>
            )}

            <button
              onClick={() =>
                downloadFile(result.audio, "mp3", result.title || "audio")
              }
              className="mt-3 w-full py-3 bg-green-600 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Unduh Audio
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-10 text-center text-white/90">
          <p className="mb-2 flex items-center justify-center gap-2">
            Made with ❤️ by{" "}
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:underline"
            >
              <img src="/instagram.png" alt="Instagram" className="w-6 h-6" />
              IG Official
            </a>
          </p>
          <p>
            Join our{" "}
            <a
              href="https://wa.me/yourchannel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5" />
              WhatsApp Channel
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}
