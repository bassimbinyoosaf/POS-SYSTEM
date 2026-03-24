import { useState, useEffect } from "react";
import AddEventModal from "../components/modal/AddEventModal";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import api from "../api/axios";

export default function EventPage() {

  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  /* ---------- LOAD FROM BACKEND ---------- */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Fetch events error:", err);
      }
    };

    fetchEvents();
  }, []);

  /* ---------- CREATE / UPDATE ---------- */
  const handleCreateEvent = async (eventData) => {
    try {
      if (editingIndex !== null) {
        // Update existing event
        const eventId = events[editingIndex].id;

        await api.put(`/events/${eventId}`, eventData);

      } else {
        // Create new event
        await api.post("/events", eventData);
      }

      // Refresh list
      const res = await api.get("/events");
      setEvents(res.data);

      setEditingIndex(null);
      setShowModal(false);

    } catch (err) {
      console.error("Save event error:", err);
    }
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async (index) => {
    try {
      const eventId = events[index].id;

      await api.delete(`/events/${eventId}`);

      const res = await api.get("/events");
      setEvents(res.data);

    } catch (err) {
      console.error("Delete event error:", err);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setShowModal(true);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] px-3 sm:px-8 py-5 sm:py-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage events for POS machine assignments
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium"
          >
            <span className="text-lg">+</span> Add Event
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium shadow transition"
            style={{ backgroundColor: "#DC2626" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#B91C1C"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#DC2626"}
          >
            <LogOut size={16}/> Logout
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">

          <table className="w-full text-sm min-w-[700px]">

            <thead className="bg-[#f8fafc] text-gray-500 text-[13px]">
              <tr className="border-b border-gray-200">
                <th className="text-left font-medium px-5 py-3">Event Name</th>
                <th className="text-left font-medium px-5 py-3">Start Date</th>
                <th className="text-left font-medium px-5 py-3">End Date</th>
                <th className="text-left font-medium px-5 py-3">Location</th>
                <th className="text-right font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <h2 className="text-lg font-semibold text-gray-800">No events created</h2>
                      <p className="text-gray-500 text-sm mt-2 max-w-sm">
                        Click <span className="font-medium text-gray-700">Add Event</span> to create your first event.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                events.map((event, i) => (
                  <tr key={event.id} className="border-b last:border-none hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">{event.name}</td>
                    <td className="px-5 py-4 text-gray-700">{event.start_date}</td>
                    <td className="px-5 py-4 text-gray-700">{event.end_date}</td>
                    <td className="px-5 py-4 text-gray-700">{event.location}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end items-center gap-4">
                        <button onClick={() => handleEdit(i)} className="text-gray-400 hover:text-indigo-600">✏️</button>
                        <button onClick={() => handleDelete(i)} className="text-red-400 hover:text-red-600">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      <AddEventModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingIndex(null);
        }}
        onCreate={handleCreateEvent}
        editData={editingIndex !== null ? events[editingIndex] : null}
      />

    </div>
  );
}