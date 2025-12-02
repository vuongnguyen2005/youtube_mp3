require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const youtubeRoute = require("./routes/youtube");

const app = express();

// Serve static frontend (Tailwind + Bootstrap UI)
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

app.use(cors());
app.use(express.json());

app.use("/api/youtube", youtubeRoute);

// Đảm bảo route "/" luôn trả về giao diện chính (fix Cannot GET / trên Vercel)
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running at: http://localhost:${PORT}`)
);
