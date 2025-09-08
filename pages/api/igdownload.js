import axios from "axios";
import cheerio from "cheerio";
import FormData from "form-data";
import CryptoJS from "crypto-js";
import { IG_COOKIES } from "../../lib/cookies";

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    // --- API Utama: allinonedownloader ---
    const rynn = await axios.get("https://allinonedownloader.com/in/");
    const $ = cheerio.load(rynn.data);
    const token = $('input[name="token"]').attr("value");

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

    const { data } = await axios.post(
      "https://allinonedownloader.com/system/f7c4d28c5e53c49.php",
      form,
      {
        headers: {
          ...form.getHeaders(),
          cookie: rynn.headers["set-cookie"].join("; "),
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
        },
      }
    );

    // --- Normalisasi data ---
    let result = {
      method: "allinonedownloader",
      type: "post",
      author: data?.author || null,
      title: data?.title || null,
      media: {
        images: [],
        videos: [],
        audio: null,
      },
    };

    if (data?.medias) {
      data.medias.forEach((m) => {
        if (m.extension === "jpg" || m.extension === "png")
          result.media.images.push(m.url);
        if (m.extension === "mp4") result.media.videos.push(m.url);
        if (m.extension === "mp3") result.media.audio = m.url;
      });
    }

    return res.status(200).json(result);
  } catch (e) {
    console.error("Fallback ke scrape IG langsung:", e.message);

    // --- Fallback Scrape langsung Instagram ---
    try {
      const html = await axios.get(url, {
        headers: {
          cookie: IG_COOKIES,
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
        },
      });

      const $ = cheerio.load(html.data);
      const script = $("script[type='application/ld+json']").html();
      const json = JSON.parse(script || "{}");

      let result = {
        method: "instagram",
        type: json["@type"] || "post",
        author: json.author?.alternateName || null,
        title: json.caption || json.headline || null,
        media: {
          images: [],
          videos: [],
          audio: null,
        },
      };

      if (json.thumbnailUrl) {
        result.media.images = Array.isArray(json.thumbnailUrl)
          ? json.thumbnailUrl
          : [json.thumbnailUrl];
      }
      if (json.contentUrl) {
        result.media.videos = [json.contentUrl];
      }

      return res.status(200).json(result);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Gagal semua sumber API", detail: err.message });
    }
  }
}
