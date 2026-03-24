import React, { useEffect, useState } from "react";
import { X, UserPlus, Store, Sparkles } from "lucide-react";
import api from "../../api/axios";   // ✅ ADD THIS

export default function AssignMachineModal({ open, onClose, onAssign, machine }) {
  const [type, setType] = useState("event");
  const [person, setPerson] = useState("");
  const [event, setEvent] = useState("");
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Fetch events error:", err);
        setEvents([]);
      }
    };

    fetchEvents();

    setType("event");
    setPerson("");
    setEvent("");
    setError("");

  }, [open]);

  if (!open) return null;

  const submit = () => {
    if (!person.trim()) return setError("Please enter assignee name");
    if (type === "event" && !event) return setError("Please select event");

    onAssign({
      id: machine?.id,
      status: type === "event" ? "At Event" : "Sold",
      assigned: person.trim(),
      event: type === "event" ? event : "-",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[70]">
      <div className="bg-white w-[520px] rounded-2xl shadow-xl p-6 relative">

        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400">
          <X size={20}/>
        </button>

        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="text-indigo-600" size={20}/>
          <h2 className="text-lg font-semibold">Assign Machine</h2>
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-600">Serial Number</label>
          <div className="mt-1 bg-gray-100 rounded-lg px-3 py-2 text-sm font-medium">
            {machine?.id}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-600 block mb-2">Assignment Type</label>
          <div className="flex gap-3">
            <button
              onClick={()=>setType('sell')}
              className={`flex-1 border rounded-xl px-4 py-3 text-sm flex items-center gap-2 justify-center ${type==='sell'?'border-indigo-500 ring-2 ring-indigo-200':'border-gray-200'}`}
            >
              <Store size={16}/> For Selling
            </button>

            <button
              onClick={()=>setType('event')}
              className={`flex-1 border rounded-xl px-4 py-3 text-sm flex items-center gap-2 justify-center ${type==='event'?'border-indigo-500 ring-2 ring-indigo-200':'border-gray-200'}`}
            >
              <Sparkles size={16}/> For Event
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-600 block mb-1">
            Assigned To (Sales Team Member)
          </label>
          <input
            value={person}
            onChange={(e)=>{setPerson(e.target.value);setError('')}}
            className="w-full border rounded-lg px-3 py-2.5 text-sm"
            placeholder="Enter name"
          />
        </div>

        {type === "event" && (
          <div className="mb-6">
            <label className="text-sm text-gray-600 block mb-1">Select Event</label>
            <select
              value={event}
              onChange={(e)=>setEvent(e.target.value)}
              className="w-full border rounded-lg px-3 py-2.5 text-sm"
            >
              <option value="">Select event</option>
              {events.map((ev)=>(
                <option key={ev.id} value={ev.name}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border rounded-lg py-2.5 text-sm">
            Cancel
          </button>
          <button onClick={submit} className="flex-1 bg-indigo-600 text-white rounded-lg py-2.5 text-sm">
            Assign Machine
          </button>
        </div>

      </div>
    </div>
  );
}