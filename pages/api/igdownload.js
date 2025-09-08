import axios from "axios";
import * as cheerio from "cheerio";
import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "Missing url parameter" });
    }

    // Step 1: Ambil halaman utama untuk ambil token
    const rynn = await axios.get("https://allinonedownloader.com/in/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116 Safari/537.36",
      },
    });

    if (!rynn.data) {
      throw new Error("Gagal mengambil halaman downloader");
    }

    const $ = cheerio.load(rynn.data);
    const token = $('input[name="token"]').attr("value");

    if (!token) {
      throw new Error("Token tidak ditemukan, kemungkinan layout berubah");
    }

    // Step 2: Encrypt URL dengan AES
    const key = CryptoJS.enc.Utf8.parse("8080808080808080");
    const iv = CryptoJS.enc.Utf8.parse("8080808080808080");

    const encrypted = CryptoJS.AES.encrypt(url, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();

    // Step 3: Kirim request untuk download link
    const response = await axios.post(
      "https://allinonedownloader.com/system/action.php",
      new URLSearchParams({
        token: token,
        data: encrypted,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116 Safari/537.36",
        },
      }
    );

    if (!response.data) {
      throw new Error("Response kosong dari server downloader");
    }

    res.status(200).json(response.data);
  } catch (err) {
    console.error("IG Downloader error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
