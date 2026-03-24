import { useEffect, useState } from "react";
import api from "../api/axios";

export default function LogsPage() {

  const [logs, setLogs] = useState([]);

  /* ---------- LOAD LOGS FROM BACKEND ---------- */
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/machines/logs");
        setLogs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch logs error:", err);
        setLogs([]);
      }
    };

    fetchLogs();
  }, []);

  /* ---------- FORMAT DATE (QATAR TIME) ---------- */
  const formatDate = (iso) => {
    if (!iso) return "-";

    return new Date(iso).toLocaleString("en-GB", {
      timeZone: "Asia/Qatar",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] p-8">

      {/* HEADER */}
      <h1 className="text-2xl font-semibold mb-6">Machine Activity Log</h1>

      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">

        <table className="w-full text-left text-sm">

          {/* TABLE HEADER */}
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-3">Serial</th>
              <th className="px-5 py-3">Action</th>
              <th className="px-5 py-3">Person</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Event</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="py-20 text-center text-gray-500">
                    No activity yet
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-t hover:bg-gray-50">

                  <td className="px-5 py-4 font-medium">
                    {log.machine_id || "-"}
                  </td>

                  <td className="px-5 py-4">
                    {log.action || "-"}
                  </td>

                  <td className="px-5 py-4">
                    {log.person || "-"}
                  </td>

                  <td className="px-5 py-4">
                    {log.phone || "-"}
                  </td>

                  <td className="px-5 py-4">
                    {log.event || "-"}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {formatDate(log.created_at)}
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}