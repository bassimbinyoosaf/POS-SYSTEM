//EditMachineModal.jsx
import React, { useEffect, useState } from "react";
import { X, Pencil } from "lucide-react";

export default function EditMachineModal({ open, onClose, onSave, machine }) {
  const GCC_COUNTRIES = [
    { name: "Qatar", code: "+974", digits: 8 },
    { name: "UAE", code: "+971", digits: 9 },
    { name: "Saudi Arabia", code: "+966", digits: 9 },
    { name: "Kuwait", code: "+965", digits: 8 },
    { name: "Oman", code: "+968", digits: 8 },
    { name: "Bahrain", code: "+973", digits: 8 },
  ];

  const [country, setCountry] = useState(GCC_COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !machine) return;

    if (machine.phone && machine.phone !== "-") {
      const found = GCC_COUNTRIES.find(c => machine.phone.startsWith(c.code));
      if (found) {
        setCountry(found);
        setPhone(machine.phone.replace(found.code, ""));
      }
    } else {
      setPhone("");
      setCountry(GCC_COUNTRIES[0]);
    }

    setNotes(machine.notes || "");
    setError("");
  }, [open, machine]);

  if (!open) return null;

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > country.digits) value = value.slice(0, country.digits);
    setPhone(value);
    setError("");
  };

  const handleSave = () => {
    if (!phone) return setError("Phone number is required");
    if (phone.length !== country.digits)
      return setError(`${country.name} number must be ${country.digits} digits`);

    onSave({
      ...machine,
      phone: `${country.code}${phone}`,
      notes,
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
          <Pencil className="text-indigo-600" size={20}/>
          <h2 className="text-lg font-semibold">Edit Machine</h2>
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-600">Serial Number</label>
          <div className="mt-1 bg-gray-100 rounded-lg px-3 py-2 text-sm font-medium">
            {machine?.id}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-600 block mb-1">SIM Phone Number</label>
          <div className="flex gap-2">
            <select
              value={country.code}
              onChange={(e)=>{
                const selected = GCC_COUNTRIES.find(c=>c.code===e.target.value);
                setCountry(selected);
                setPhone("");
                setError("");
              }}
              className="border rounded-lg px-2 py-2.5 text-sm w-[130px]"
            >
              {GCC_COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.name} {c.code}</option>
              ))}
            </select>

            <input
              value={phone}
              onChange={handlePhoneChange}
              className={`flex-1 border rounded-lg px-3 py-2.5 text-sm ${error ? 'border-red-400' : ''}`}
              placeholder={`Enter ${country.digits} digit number`}
            />
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-600 block mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e)=>setNotes(e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-sm"
            placeholder="Additional notes about this machine..."
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border rounded-lg py-2.5 text-sm">Cancel</button>
          <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white rounded-lg py-2.5 text-sm">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
