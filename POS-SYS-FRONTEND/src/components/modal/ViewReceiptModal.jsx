import React, { useEffect, useState } from "react";
import {
  X,
  FileText,
  File,
  Download,
  Eye,
  Trash2
} from "lucide-react";
import api from "../../api/axios";

export default function ViewReceiptModal({ open, onClose, machine }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    if (!open || !machine) return;

    const fetchFiles = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/machines/${machine.id}/receipts`);
        setFiles(res.data || []);
      } catch (err) {
        console.error("Fetch receipts error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [open, machine]);

  if (!open || !machine) return null;

  const handleDelete = async (fileName) => {
    if (!confirm("Delete this receipt?")) return;

    try {
      await api.delete(`/machines/${machine.id}/receipts/${fileName}`);

      setFiles(prev => prev.filter(f => f.name !== fileName));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete receipt");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white w-[700px] max-h-[85vh] rounded-2xl shadow-xl flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Receipts</h2>
            <p className="text-sm text-gray-500">
              Machine: {machine.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto">

          {loading && (
            <p className="text-sm text-gray-500">Loading...</p>
          )}

          {!loading && files.length === 0 && (
            <div className="text-center py-20 text-gray-500 text-sm">
              No receipts uploaded yet
            </div>
          )}

          {!loading && files.length > 0 && (
            <div className="grid grid-cols-2 gap-4">

              {files.map((file, index) => (
                <div
                  key={index}
                  className="relative border rounded-xl p-4 hover:shadow-md transition group bg-white"
                >

                  {/* DELETE BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file.name);
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-white rounded-full p-1 shadow hover:bg-red-50"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>

                  {/* FILE INFO */}
                  <div className="flex items-center gap-3">

                    <div
                      className={`p-3 rounded-xl ${
                        file.name.toLowerCase().endsWith(".pdf")
                          ? "bg-red-50 text-red-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {file.name.toLowerCase().endsWith(".pdf")
                        ? <FileText size={22}/>
                        : <File size={22}/>
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {file.size
                          ? (file.size / 1024).toFixed(1) + " KB"
                          : ""}
                      </p>
                    </div>

                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition">

                    {file.name.toLowerCase().endsWith(".pdf") && (
                      <button
                        onClick={() =>
                          window.open(`${baseURL}${file.url}`, "_blank")
                        }
                        className="flex-1 bg-indigo-600 text-white text-xs py-1.5 rounded-lg flex items-center justify-center gap-1"
                      >
                        <Eye size={14}/> Preview
                      </button>
                    )}

                    <a
                      href={`${baseURL}${file.url}`}
                      download
                      className="flex-1 border text-xs py-1.5 rounded-lg flex items-center justify-center gap-1"
                    >
                      <Download size={14}/> Download
                    </a>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}