const db = require("../config/db");

/* -------- GET EVENTS -------- */
exports.getEvents = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM events ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Get events error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------- CREATE EVENT -------- */
exports.createEvent = async (req, res) => {
  const { name, start, end, location } = req.body;

  if (!name || !start || !end || !location)
    return res.status(400).json({ message: "All fields required" });

  try {
    await db.query(
      "INSERT INTO events (name, start_date, end_date, location) VALUES (?, ?, ?, ?)",
      [name, start, end, location]
    );

    res.status(201).json({ message: "Event created" });
  } catch (err) {
    console.error("Create event error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------- DELETE EVENT -------- */
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM events WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("Delete event error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { name, start, end, location } = req.body;

  try {
    await db.query(
      "UPDATE events SET name=?, start_date=?, end_date=?, location=? WHERE id=?",
      [name, start, end, location, id]
    );

    res.json({ message: "Event updated" });
  } catch (err) {
    console.error("Update event error:", err);
    res.status(500).json({ message: "Server error" });
  }
};