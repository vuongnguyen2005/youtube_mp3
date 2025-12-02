require("dotenv").config();
const express = require("express");
const cors = require("cors");

const youtubeRoute = require("./routes/youtube");

const app = express();

// Serve static frontend (Tailwind + Bootstrap UI)
app.use(express.static("public"));

app.use(cors());
app.use(express.json());

app.use("/api/youtube", youtubeRoute);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at: http://localhost:${PORT}`));
