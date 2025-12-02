require("dotenv").config();
const axios = require("axios");

// Serverless function cho Vercel: /api/youtube/download
// Trả về response đã được chuẩn hóa để frontend có thể xử lý nhất quán.

module.exports = async (req, res) => {
  const videoId = req.query.id;

  if (!videoId) {
    return res
      .status(400)
      .json({ status: "error", error: "Thiếu tham số id (YouTube video id)" });
  }

  if (!process.env.RAPID_API_KEY) {
    console.error("Missing RAPID_API_KEY in environment");
    return res.status(500).json({
      status: "error",
      error: "Server chưa cấu hình RAPID_API_KEY",
    });
  }

  const options = {
    method: "GET",
    url: "https://youtube-mp36.p.rapidapi.com/dl",
    params: { id: videoId },
    headers: {
      "x-rapidapi-host": "youtube-mp36.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPID_API_KEY,
    },
  };

  try {
    const response = await axios.request(options);

    // Normalize response shape so frontend doesn't depend on RapidAPI exact format
    const d = response.data || {};

    // Try to map common fields returned by the service
    const normalized = {
      status: d.status || (d.link ? "ok" : "error"),
      link: d.link || d.result || null,
      title: d.title || d.videoTitle || null,
      channel: d.channel || d.author || null,
      duration: d.duration || null,
      mp3Length: d.duration || null,
      raw: d,
    };

    if (normalized.status !== "ok" || !normalized.link) {
      return res.status(400).json({ status: "error", msg: d.msg || d.message || "Không thể tạo link MP3", raw: d });
    }

    return res.status(200).json(normalized);
  } catch (error) {
    console.error("YouTube MP3 API error:", error?.response?.data || error.message || error);
    return res.status(500).json({
      status: "error",
      error: "Không thể xử lý yêu cầu",
      detail: error?.response?.data || error.message || String(error),
    });
  }
};



