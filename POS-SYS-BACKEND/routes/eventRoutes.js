const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  getEvents,
  createEvent,
  deleteEvent,
  updateEvent
} = require("../controllers/eventController");

router.use(auth);

router.get("/", getEvents);
router.post("/", createEvent);
router.delete("/:id", admin, deleteEvent);
router.put("/:id", updateEvent);

module.exports = router;