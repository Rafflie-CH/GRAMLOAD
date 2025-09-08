import aio from "../../lib/aio";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const result = await aio(url);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch data" });
  }
}
