const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static('public'));

// API endpoint xử lý tải MP3
app.get('/api/youtube/download', async (req, res) => {
  try {
    const videoId = req.query.id;

    if (!videoId) {
      return res.status(400).json({
        status: 'error',
        msg: 'Video ID không hợp lệ'
      });
    }

    if (!process.env.RAPID_API_KEY) {
      console.error('Missing RAPID_API_KEY in environment');
      return res.status(500).json({ status: 'error', msg: 'Server chưa cấu hình RAPID_API_KEY' });
    }

    console.log('Đang tải video ID:', videoId);

    const options = {
      method: 'GET',
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      params: { id: videoId },
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY,
        'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    console.log('Response từ API:', response.data);

    const d = response.data || {};
    const normalized = {
      status: d.status || (d.link ? 'ok' : 'error'),
      link: d.link || d.result || null,
      title: d.title || d.videoTitle || 'Video MP3',
      channel: d.channel || d.author || 'YouTube Channel',
      duration: d.duration || '00:00',
      mp3Length: d.duration || null
    };

    if (normalized.status === 'ok' && normalized.link) {
      return res.json(normalized);
    } else {
      return res.status(400).json({
        status: 'error',
        msg: d.msg || 'Không thể tải video',
        raw: d
      });
    }
  } catch (error) {
    console.error('Lỗi API:', error?.response?.data || error.message || error);
    const errorMsg = error.response?.data?.message || error.message || 'Không thể tải video';
    res.status(500).json({
      status: 'error',
      msg: errorMsg,
      detail: error?.response?.data || null
    });
  }
});

app. get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use((err, req, res, next) => {
  console.error('Lỗi server:', err);
  res.status(500). json({
    status: 'error',
    msg: 'Lỗi server nội bộ'
  });
});

const PORT = process.env. PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
  console.log(`📝 API endpoint: GET /api/youtube/download?id=VIDEO_ID`);
});