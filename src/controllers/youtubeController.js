const axios = require("axios");

const downloadMP3 = async (req, res) => {
    const videoId = req.query.id; 

    if (!videoId) {
        return res.status(400).json({ error: "Thiếu tham số id" });
    }

    const options = {
        method: 'GET',
        url: 'https://youtube-mp36.p.rapidapi.com/dl',
        params: { id: videoId },
        headers: {
            'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPID_API_KEY
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Không thể xử lý yêu cầu", detail: error.message });
    }
};

module.exports = { downloadMP3 };
