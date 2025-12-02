const express = require("express");
const router = express.Router();
const { downloadMP3 } = require("../controllers/youtubeController");

router.get("/download", downloadMP3);

module.exports = router;
