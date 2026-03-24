//ConfirmDeleteModal.jsx
import React from "react";
import { X, AlertTriangle } from "lucide-react";

export default function ConfirmDeleteModal({ open, onClose, onConfirm, machine }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
      <div className="bg-white w-[420px] rounded-2xl shadow-xl p-6 relative">

        {/* close */}
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400">
          <X size={20} />
        </button>

        {/* icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="text-red-600" size={22} />
          </div>
        </div>

        {/* text */}
        <h2 className="text-lg font-semibold text-center mb-2">Delete Machine</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Are you sure you want to delete
          <span className="font-medium text-gray-900"> {machine?.id}</span>?
          <br />
          This action cannot be undone.
        </p>

        {/* actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-2.5 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(machine)}
            className="flex-1 bg-red-600 text-white rounded-lg py-2.5 text-sm hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}