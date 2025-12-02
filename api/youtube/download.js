const axios = require("axios");

// Serverless function cho Vercel: /api/youtube/download
// Hoạt động tương tự controller downloadMP3 trong src/controllers/youtubeController.js

module.exports = async (req, res) => {
  const videoId = req.query.id;

  if (!videoId) {
    return res
      .status(400)
      .json({ status: "error", error: "Thiếu tham số id (YouTube video id)" });
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
    // Trả nguyên data từ RapidAPI để frontend dùng luôn
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("YouTube MP3 API error:", error.message);
    return res.status(500).json({
      status: "error",
      error: "Không thể xử lý yêu cầu",
      detail: error.message,
    });
  }
};


