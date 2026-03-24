const db = require("../config/db");

/* ---------------- GET MACHINES ---------------- */
exports.getMachines = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM machines"
    );
    res.json(rows);
  } catch (err) {
    console.error("Get machines error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- CREATE MACHINE ---------------- */
exports.createMachine = async (req, res) => {
  const { id, phone } = req.body;

  if (!id)
    return res.status(400).json({ message: "Machine ID required" });

  try {
    await db.query(
      "INSERT INTO machines (id, phone) VALUES (?, ?)",
      [id, phone || "-"]
    );

    res.status(201).json({ message: "Machine created" });

  } catch (err) {
    console.error("Create machine error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- UPDATE MACHINE ---------------- */
exports.updateMachine = async (req, res) => {
  const { id } = req.params;
  const { phone } = req.body;

  try {
    await db.query(
      "UPDATE machines SET phone = ? WHERE id = ?",
      [phone, id]
    );

    res.json({ message: "Machine updated" });

  } catch (err) {
    console.error("Update machine error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- DELETE MACHINE ---------------- */
exports.deleteMachine = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM machines WHERE id = ?",
      [id]
    );

    // If nothing deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Machine not found" });
    }

    // Log delete
    await db.query(
      "INSERT INTO machine_logs (machine_id, action, person, phone, event) VALUES (?, ?, ?, ?, ?)",
      [id, "Deleted", "-", "-", "-"]
    );

    res.json({ message: "Machine deleted" });

  } catch (err) {
    console.error("Delete machine error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- ASSIGN MACHINE ---------------- */
exports.assignMachine = async (req, res) => {
  const { id } = req.params;
  const { assigned, phone, event } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      "UPDATE machines SET status='At Event', assigned=?, phone=?, event=? WHERE id=?",
      [assigned, phone || "-", event, id]
    );

    await connection.query(
      "INSERT INTO machine_logs (machine_id, action, person, phone, event) VALUES (?, ?, ?, ?, ?)",
      [id, "Assigned To Event", assigned, phone || "-", event]
    );

    await connection.commit();
    connection.release();

    res.json({ message: "Machine assigned" });

  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("Assign error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- SELL MACHINE ---------------- */
exports.sellMachine = async (req, res) => {
  const { id } = req.params;
  const { assigned, phone } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      "UPDATE machines SET status='Sold', assigned=?, phone=?, soldAt=NOW() WHERE id=?",
      [assigned, phone || "-", id]
    );

    await connection.query(
      "INSERT INTO machine_logs (machine_id, action, person, phone, event) VALUES (?, ?, ?, ?, ?)",
      [id, "Sold", assigned, phone || "-", "-"]
    );

    await connection.commit();
    connection.release();

    res.json({ message: "Machine sold" });

  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("Sell error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- RETURN MACHINE ---------------- */
exports.returnMachine = async (req, res) => {
  const { id } = req.params;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // get current machine
    const [rows] = await connection.query(
      "SELECT * FROM machines WHERE id=?",
      [id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ message: "Machine not found" });
    }

    const machine = rows[0];

    let actionType =
      machine.status === "Sold"
        ? "Returned From Sold"
        : "Returned From Event";

    await connection.query(
      "UPDATE machines SET status='Available', assigned='-', event='-', soldAt=NULL WHERE id=?",
      [id]
    );

    await connection.query(
      "INSERT INTO machine_logs (machine_id, action, person, phone, event) VALUES (?, ?, ?, ?, ?)",
      [id, actionType, machine.assigned || "-", machine.phone || "-", machine.event || "-"]
    );

    await connection.commit();
    connection.release();

    res.json({ message: "Machine returned to stock" });

  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("Return error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- GET LOGS ---------------- */
exports.getLogs = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM machine_logs ORDER BY created_at DESC"
    );

    res.json(rows);

  } catch (err) {
    console.error("Get logs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};