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
      return res. status(400).json({
        status: 'error',
        msg: 'Video ID không hợp lệ'
      });
    }

    console.log('Đang tải video ID:', videoId);

    const options = {
      method: 'GET',
      url: 'https://youtube-mp36.p.rapidapi.com/downloadlink',
      params: { id: videoId },
      headers: {
        'x-rapidapi-key': process. env.RAPID_API_KEY,
        'x-rapidapi-host': 'youtube-mp36.p. rapidapi.com'
      }
    };

    const response = await axios. request(options);
    console.log('Response từ API:', response.data);

    if (response.data.status === 'ok' && response.data.link) {
      return res.json({
        status: 'ok',
        link: response.data.link,
        title: response.data.title || 'Video MP3',
        channel: response.data.channel || 'YouTube Channel',
        duration: response.data. duration || '00:00',
        mp3Length: response.data.duration
      });
    } else {
      return res.status(400).json({
        status: 'error',
        msg: response.data.msg || 'Không thể tải video'
      });
    }
  } catch (error) {
    console. error('Lỗi API:', error. message);
    const errorMsg = error.response?.data?.message || error.message || 'Không thể tải video';
    res.status(500).json({
      status: 'error',
      msg: errorMsg
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