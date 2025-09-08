import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/igdownload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Gagal mengambil data");
      }
    } catch (err) {
      setError("Terjadi kesalahan server");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 text-white px-4">
      <Head>
        <title>IGLoad BY RAFZ - Instagram Downloader</title>
        <meta
          name="description"
          content="Download foto, video, reels, dan story Instagram secara gratis dengan IGLoad BY RAFZ. 100% FREE tanpa login!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-4xl font-bold mb-6">IGLoad BY RAFZ</h1>
      <p className="mb-4 text-center">
        Masukkan link Instagram (Post, Reels, atau Story) untuk download tanpa ribet!
      </p>

      <div className="flex gap-2 w-full max-w-lg">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Tempelkan URL Instagram di sini..."
          className="flex-1 px-4 py-2 rounded-xl text-black"
        />
        <button
          onClick={handleDownload}
          disabled={loading}
          className="bg-white text-pink-600 font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition"
        >
          {loading ? "Loading..." : "Download"}
        </button>
      </div>

      {error && <p className="mt-4 text-red-200">{error}</p>}

      {result && (
        <div className="mt-6 w-full max-w-2xl bg-white text-black rounded-xl p-4 shadow-lg">
          <h2 className="text-lg font-bold mb-2">{result.caption || "Tanpa Caption"}</h2>
          <p className="text-sm text-gray-600 mb-4">
            {result.type} oleh {result.author}
          </p>

          <div className="space-y-4">
            {result.media.map((m, i) => (
              <div key={i} className="rounded overflow-hidden">
                {m.type === "video" ? (
                  <video controls className="w-full rounded">
                    <source src={m.url} type="video/mp4" />
                  </video>
                ) : (
                  <img src={m.url} alt="Instagram Media" className="w-full rounded" />
                )}
                <a
                  href={m.url}
                  download
                  className="block mt-2 bg-pink-600 text-white px-4 py-2 rounded text-center hover:bg-pink-700 transition"
                >
                  Download {m.type}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="mt-10 text-center space-y-3">
        <p>Made with ❤️ by RAFZ</p>
        <a
          href="https://wa.me/628xxxxxxx"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600 transition"
        >
          Saluran WhatsApp
        </a>
        <div>
          <p className="font-semibold">Coba produk kami yang lain:</p>
          <a href="https://tikload.rafzhost.xyz" className="underline">
            TikLoad (Tiktok Downloader)
          </a>
        </div>
      </footer>
    </div>
  );
}
