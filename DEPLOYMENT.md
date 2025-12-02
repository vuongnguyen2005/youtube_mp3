# YouTube MP3 Downloader - Deployment Guide

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Thêm `RAPID_API_KEY` của bạn vào `.env`:
   ```
   RAPID_API_KEY=your_key_here
   ```

3. **Run development server**:
   ```bash
   node src/app.js
   ```
   Mở http://localhost:3000

---

## Deploy to Vercel

### Step 1: Create Vercel Project
- Đi tới https://vercel.com/dashboard
- Click "New Project"
- Connect GitHub repo của bạn
- Click "Import"

### Step 2: **IMPORTANT - Set Environment Variables on Vercel**
Đây là bước **BẮT BUỘC** để fix lỗi của bạn!

1. Sau khi import, Vercel sẽ hiển thị "Configure Project"
2. Tìm mục **"Environment Variables"**
3. Thêm biến:
   - **Name**: `RAPID_API_KEY`
   - **Value**: (giá trị key từ RapidAPI của bạn — xem file `.env`)
   - **Environments**: Select `Production`, `Preview`, và `Development`
4. Click "Save"
5. Click "Deploy"

### Step 3: Redeploy (if already deployed)
Nếu bạn đã deploy trước đó mà chưa set env var, bây giờ hãy:
1. Vào Project Settings → Environment Variables
2. Thêm `RAPID_API_KEY` như trên
3. Vào Deployments → chọn deployment mới nhất → click "Redeploy"

---

## Project Structure

- `api/youtube/download.js` — Vercel serverless function (được gọi khi fetch `/api/youtube/download?id=...`)
- `public/index.html` — Frontend UI
- `src/app.js` — Local development Express server (không dùng khi deploy Vercel)
- `.env` — Local development only (không commit lên repo)
- `vercel.json` — Vercel routing configuration

---

## Troubleshooting

**Lỗi: "Có lỗi xảy ra khi tải MP3"**
- Check: Vercel dashboard → Project → Settings → Environment Variables
- Đảm bảo `RAPID_API_KEY` đã được set và đúng giá trị
- Nếu vẫn lỗi, check Vercel logs:
  - Vào Deployments → chọn deployment → Scroll down → xem Logs section

**Lỗi: "Cannot GET /"**
- Đây là bình thường, Vercel router sẽ serve `public/index.html` — check `vercel.json` configuration

**RapidAPI Rate Limit hoặc Key Invalid**
- Kiểm tra RapidAPI dashboard: https://rapidapi.com/dashboard
- Xem subscription status và remaining API calls
- Thử regenerate key nếu cần

---

## Security

- ✅ `.env` được add vào `.gitignore` — không commit key lên GitHub
- ✅ Key được set trong Vercel dashboard (secured)
- ❌ Không commit `.env` file lên repo

---

## Support

Nếu vẫn gặp vấn đề sau khi follow các bước này, hãy:
1. Capture screenshot of error message từ frontend
2. Share Vercel logs (từ Deployments → Functions logs)
3. Verify RAPID_API_KEY value match giữa `.env` (local) và Vercel dashboard

