import axios from "axios";
import * as cheerio from "cheerio";
import cookies from "../../cookies";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Rotasi cookies → pilih random
    const cookie = cookies[Math.floor(Math.random() * cookies.length)];

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
        Cookie: cookie,
      },
    });

    const $ = cheerio.load(response.data);

    // Ambil JSON dari <script type="application/ld+json">
    const jsonData = $("script[type='application/ld+json']").html();
    if (!jsonData) {
      return res.status(404).json({ error: "No media found or cookies expired" });
    }

    const data = JSON.parse(jsonData);

    // Format respons agar rapi
    const result = {
      type: data["@type"] || "post",
      caption: data.caption || "",
      author: data.author?.name || "",
      media: [],
    };

    if (Array.isArray(data.video)) {
      result.media.push(...data.video.map((v) => ({ type: "video", url: v.contentUrl })));
    } else if (data.video) {
      result.media.push({ type: "video", url: data.video.contentUrl });
    }

    if (Array.isArray(data.image)) {
      result.media.push(...data.image.map((img) => ({ type: "image", url: img.contentUrl })));
    } else if (data.image) {
      result.media.push({ type: "image", url: data.image.contentUrl });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("IG Download Error:", error.message);
    return res.status(500).json({ error: "Failed to fetch media" });
  }
}
