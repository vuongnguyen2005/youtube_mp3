const axios = require("axios");

const downloadMP3 = async (req, res) => {
    const videoId = req.query.id; 

    if (!videoId) {
        return res.status(400).json({ error: "Thiếu tham số id" });
    }

    if (!process.env.RAPID_API_KEY) {
        console.error('Missing RAPID_API_KEY in environment');
        return res.status(500).json({ error: 'Server chưa cấu hình RAPID_API_KEY' });
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
        const d = response.data || {};
        const normalized = {
            status: d.status || (d.link ? 'ok' : 'error'),
            link: d.link || d.result || null,
            title: d.title || d.videoTitle || null,
            channel: d.channel || d.author || null,
            duration: d.duration || null,
            mp3Length: d.duration || null,
            raw: d,
        };

        if (normalized.status !== 'ok' || !normalized.link) {
            return res.status(400).json({ status: 'error', msg: d.msg || d.message || 'Không thể tạo link MP3', raw: d });
        }

        res.json(normalized);
    } catch (error) {
        console.error('YouTube MP3 API error:', error?.response?.data || error.message || error);
        res.status(500).json({ error: "Không thể xử lý yêu cầu", detail: error?.response?.data || error.message || String(error) });
    }
};

module.exports = { downloadMP3 };
