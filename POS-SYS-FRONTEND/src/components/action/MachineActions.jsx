import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  RotateCcw,
  Pencil,
  FileText,
  Trash2,
  UserPlus,
  Eye
} from "lucide-react";
import api from "../../api/axios";

export default function MachineActions({
  machine,
  onAssign,
  onReturnToStock,
  onEdit,
  onReceipt,
  onViewReceipt,
  onDelete,
  isAdmin
}) {
  const [open, setOpen] = useState(false);
  const [hasReceipt, setHasReceipt] = useState(false);
  const ref = useRef(null);

  /* ---------- CLOSE DROPDOWN OUTSIDE CLICK ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------- CHECK IF RECEIPTS EXIST ---------- */
  useEffect(() => {
    if (!open || !machine?.id) return;

    const checkReceipts = async () => {
      try {
        const res = await api.get(`/machines/${machine.id}/receipts`);
        setHasReceipt(res.data.length > 0);
      } catch {
        setHasReceipt(false);
      }
    };

    checkReceipts();
  }, [open, machine]);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="text-gray-400 hover:text-gray-600 transition"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-30 overflow-hidden">

          {/* Assign / Return */}
          {machine?.status === "Available" ? (
            <button
              onClick={() => { setOpen(false); onAssign(machine); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-gray-50">
              <UserPlus size={16}/> Assign
            </button>
          ) : (
            <button
              onClick={() => { setOpen(false); onReturnToStock(machine); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-gray-50">
              <RotateCcw size={16}/> Return to Stock
            </button>
          )}

          {/* Edit */}
          <button
            onClick={() => { setOpen(false); onEdit(machine); }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-gray-50">
            <Pencil size={16}/> Edit Details
          </button>

          {/* Upload */}
          <button
            onClick={() => { setOpen(false); onReceipt(machine); }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-gray-50">
            <FileText size={16}/> Acknowledgment Receipt
          </button>

          {/* VIEW RECEIPT (Only if files exist) */}
          {hasReceipt && (
            <button
              onClick={() => { setOpen(false); onViewReceipt(machine); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50">
              <Eye size={16}/> View Receipt
            </button>
          )}

          {/* Delete */}
          {isAdmin && (
            <button
              onClick={() => { setOpen(false); onDelete(machine); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
              <Trash2 size={16}/> Delete
            </button>
          )}

        </div>
      )}
    </div>
  );
}