const axios = require("axios");
const cheerio = require("cheerio");
const FormData = require("form-data");
const CryptoJS = require("crypto-js");

async function aio(url) {
  try {
    const SUPPORTED_PLATFORMS = [
      /^https?:\/\/(www\.)?instagram\.com\/.+/i,
      /^https?:\/\/(www\.)?instagram\.com\/reel\/.+/i,
      /^https?:\/\/(www\.)?instagram\.com\/stories\/.+/i,
    ];

    if (!url) throw new Error("Url is required");
    if (!SUPPORTED_PLATFORMS.some((regex) => regex.test(url)))
      throw new Error("Platform not supported");

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
          accept: "*/*",
          cookie: rynn.headers["set-cookie"].join("; "),
          "user-agent":
            "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/139 Mobile Safari/537.36",
          "x-requested-with": "XMLHttpRequests",
          ...form.getHeaders(),
        },
      }
    );

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = aio;
