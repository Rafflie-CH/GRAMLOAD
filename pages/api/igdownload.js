import axios from "axios";
import cheerio from "cheerio";
import FormData from "form-data";
import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL diperlukan" });
  }

  try {
    // daftar platform yang didukung (fokus ke IG)
    const SUPPORTED = [
      /^https?:\/\/(www\.)?instagram\.com\/reel\/.+/i,
      /^https?:\/\/(www\.)?instagram\.com\/stories\/.+/i,
      /^https?:\/\/(www\.)?instagram\.com\/p\/.+/i,
    ];

    if (!SUPPORTED.some((r) => r.test(url))) {
      return res.status(400).json({ error: "Hanya mendukung Instagram reels, stories, dan postingan." });
    }

    // ambil token
    const rynn = await axios.get("https://allinonedownloader.com/in/");
    const $ = cheerio.load(rynn.data);
    const token = $('input[name="token"]').attr("value");

    // enkripsi url
    const key = CryptoJS.enc.Hex.parse(token);
    const iv = CryptoJS.enc.Hex.parse("afc4e290725a3bf0ac4d3ff826c43c10");
    const encrypted = CryptoJS.AES.encrypt(url, key, {
      iv,
      padding: CryptoJS.pad.ZeroPadding,
    });

    const form = new FormData();
    form.append("url", url);
    form.append("token", token);
    form.append("urlhash", encrypted.toString());

    // kirim request
    const { data } = await axios.post(
      "https://allinonedownloader.com/system/f7c4d28c5e53c49.php",
      form,
      {
        headers: {
          accept: "*/*",
          cookie: rynn.headers["set-cookie"].join("; "),
          "user-agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
          "x-requested-with": "XMLHttpRequests",
          ...form.getHeaders(),
        },
      }
    );

    // siapkan hasil
    const result = {
      type: "post", // default
      caption: data?.title || "Tanpa judul",
      videos: [],
      images: [],
      audio: null,
    };

    // deteksi type (story / reel / post)
    if (url.includes("/stories/")) result.type = "story";
    else if (url.includes("/reel/")) result.type = "reel";
    else result.type = "post";

    // parsing media
    if (data?.medias && Array.isArray(data.medias)) {
      data.medias.forEach((m) => {
        if (m.extension?.includes("mp4")) {
          result.videos.push(m.url);
        } else if (m.extension?.includes("jpg") || m.extension?.includes("png")) {
          result.images.push(m.url);
        } else if (m.extension?.includes("mp3")) {
          result.audio = m.url;
        }
      });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("IG Downloader error:", err.message);
    return res.status(500).json({ error: "Gagal memproses URL." });
  }
}
