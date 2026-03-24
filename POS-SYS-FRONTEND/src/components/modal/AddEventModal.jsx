//AddEventModal.jsx
import { useState, useEffect } from "react";

export default function AddEventModal({ open, onClose, onCreate, editData }) {

  const [shake, setShake] = useState(false);

  const [form, setForm] = useState({
    name: "",
    start: "",
    end: "",
    location: "",
    description: ""
  });
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  useEffect(() => {
    if (editData) setForm(editData);
  }, [editData]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.name || !form.start) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    if (form.end && new Date(form.end) < new Date(form.start)) {
      setDateError("End date cannot be before start date");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setDateError("");

    onCreate(form);
    onClose();

    setForm({
      name: "",
      start: "",
      end: "",
      location: "",
      description: ""
    });
  };


  const inputStyle =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  const labelStyle = "text-sm font-medium text-gray-700 mb-1 block";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50 p-4 overflow-y-auto">

      <div className={`bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative ${shake ? "animate-shake" : ""}`}>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {editData ? "Edit Event" : "Add New Event"}
        </h2>

        {/* Event Name */}
        <div className="mb-4">
          <label className={labelStyle}>
            Event Name <span className="text-red-500">*</span>
          </label>
          <input
            className={inputStyle}
            placeholder="Tech Expo 2024"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Dates */}
  <div className="mb-4">

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className={labelStyle}>
          Start Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          className={inputStyle}
          value={form.start}
          onChange={(e) => setForm({ ...form, start: e.target.value })}
        />
      </div>

      <div>
        <label className={labelStyle}>End Date</label>
        <input
          type="date"
          className={inputStyle}
          value={form.end}
          onChange={(e) => setForm({ ...form, end: e.target.value })}
        />
      </div>
    </div>

    {/* ERROR MESSAGE — THIS IS THE CORRECT PLACE */}
    {dateError && (
      <p className="text-red-500 text-xs mt-2">{dateError}</p>
    )}

  </div>


        {/* Location */}
        <div className="mb-4">
          <label className={labelStyle}>Location</label>
          <input
            className={inputStyle}
            placeholder="Convention Center"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className={labelStyle}>Description</label>
          <textarea
            rows="3"
            className={`${inputStyle} resize-none`}
            placeholder="Event details..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="w-1/2 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="w-1/2 py-2.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {editData ? "Update" : "Create"}
          </button>
        </div>

      </div>
    </div>
  );
}
