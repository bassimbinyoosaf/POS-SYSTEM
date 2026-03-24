const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const path = require("path");
const fs = require("fs");
const admin = require("../middleware/adminMiddleware");

const {
  getMachines,
  createMachine,
  updateMachine,
  deleteMachine,
  assignMachine,
  sellMachine,
  returnMachine,
  getLogs
} = require("../controllers/machineController");

/* ---------------- PROTECT ALL ROUTES ---------------- */
router.use(auth);

/* ---------------- LOGS ---------------- */
router.get("/logs", admin, getLogs);

/* ---------------- MACHINE CRUD ---------------- */
router.get("/", getMachines);
router.post("/", createMachine);
router.put("/:id", updateMachine);
router.delete("/:id", admin, deleteMachine);

/* ---------------- MACHINE ACTIONS ---------------- */
router.post("/:id/assign", assignMachine);
router.post("/:id/sell", sellMachine);
router.post("/:id/return", returnMachine);

/* =========================================================
   RECEIPT SYSTEM (MULTI-FILE SUPPORT)
========================================================= */

/* ---------------- UPLOAD RECEIPT ---------------- */
router.post(
  "/:id/upload-receipt",
  upload.single("receipt"),
  async (req, res) => {

    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const machineDir = path.join(__dirname, "..", "uploads", id);

      // Ensure folder exists
      if (!fs.existsSync(machineDir)) {
        fs.mkdirSync(machineDir, { recursive: true });
      }

      const filePath = `/uploads/${id}/${req.file.filename}`;

      res.json({
        message: "Receipt uploaded successfully",
        file: {
          name: req.file.filename,
          path: filePath
        }
      });

    } catch (err) {
      console.error("Receipt upload error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ---------------- GET ALL RECEIPTS FOR MACHINE ---------------- */
router.get("/:id/receipts", (req, res) => {

  const { id } = req.params;

  try {
    const machineDir = path.join(__dirname, "..", "uploads", id);

    if (!fs.existsSync(machineDir)) {
      return res.json([]);
    }

    const files = fs.readdirSync(machineDir);

    const fileList = files.map(file => {
      const filePath = `/uploads/${id}/${file}`;
      const fullPath = path.join(machineDir, file);
      const stats = fs.statSync(fullPath);

      return {
        name: file,
        url: filePath,
        size: stats.size,
        uploadedAt: stats.mtime
      };
    });

    res.json(fileList);

  } catch (err) {
    console.error("Get receipts error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------- DELETE SPECIFIC RECEIPT ---------------- */
router.delete("/:id/receipts/:filename", (req, res) => {

  const { id, filename } = req.params;

  try {
    const filePath = path.join(__dirname, "..", "uploads", id, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    fs.unlinkSync(filePath);

    res.json({ message: "Receipt deleted successfully" });

  } catch (err) {
    console.error("Delete receipt error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;