import axios from "axios";
import cheerio from "cheerio";
import FormData from "form-data";
import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { url } = req.body;

  try {
    if (!url) throw new Error("URL tidak boleh kosong");

    const SUPPORTED = [
      /^https?:\/\/(www\.)?instagram\.com\/.+/i,
      /^https?:\/\/(www\.)?instagram\.com\/reel\/.+/i,
      /^https?:\/\/(www\.)?instagram\.com\/stories\/.+/i,
    ];
    if (!SUPPORTED.some((r) => r.test(url))) {
      throw new Error("Hanya mendukung Instagram (post, reel, stories)");
    }

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
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
          "x-requested-with": "XMLHttpRequest",
          cookie: rynn.headers["set-cookie"]?.join("; ") || "",
        },
      }
    );

    res.status(200).json({
      type: data.medias[0].type, // video or image
      url: data.medias[0].url,
      audio: data.medias.find((m) => m.extension === "mp3")?.url || null,
      title: data.title || "instagram",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
