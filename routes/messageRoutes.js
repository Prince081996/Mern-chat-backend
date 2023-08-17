const express = require("express");
const {
  sendMessage,
  allMessages,
  findThread
} = require("../controllers/messageController");

const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/getThread").get(protect,findThread)
router.route("/:chatId").get(protect, allMessages);

module.exports = router;
