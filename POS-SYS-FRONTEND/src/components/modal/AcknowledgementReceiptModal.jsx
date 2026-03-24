import React, { useState } from "react";
import { X, UploadCloud, Download } from "lucide-react";
import api from "../../api/axios";

export default function AcknowledgementReceiptModal({ open, onClose, machine }) {

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  if (!open) return null;

  /* ---------- DOWNLOAD TEMPLATE ---------- */
  const handleDownloadTemplate = () => {
    window.open("/templates/Acknowledgement%20Receipt.docx", "_blank");
  };

  /* ---------- FILE SELECT ---------- */
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowedExtensions = [".pdf", ".docx"];
    const fileName = selected.name.toLowerCase();

    const isValid = allowedExtensions.some(ext =>
      fileName.endsWith(ext)
    );

    if (!isValid) {
      setError("Only PDF and DOCX files are allowed");
      setFile(null);
      return;
    }

    setError("");
    setFile(selected);
  };

  /* ---------- UPLOAD ---------- */
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("receipt", file);

      await api.post(
        `/machines/${machine.id}/upload-receipt`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUploading(false);
      onClose();

    } catch (err) {
      setUploading(false);
      setError(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[80]">
      <div className="bg-white w-[520px] rounded-2xl shadow-xl p-6 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20}/>
        </button>

        {/* HEADER */}
        <h2 className="text-lg font-semibold mb-4">
          Acknowledgement Receipt
        </h2>

        {/* MACHINE SERIAL */}
        <div className="mb-6">
          <label className="text-sm text-gray-600">Machine Serial</label>
          <div className="mt-1 bg-gray-100 rounded-lg px-3 py-2 text-sm font-medium">
            {machine?.id}
          </div>
        </div>

        {/* STEP 1 */}
        <div className="border rounded-xl p-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-semibold">
              1
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-gray-800">
                Download Template
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                Download the acknowledgement receipt template
              </p>

              <button
                onClick={handleDownloadTemplate}
                className="w-full border border-gray-300 rounded-lg py-2 text-sm flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                <Download size={16}/> Download Template
              </button>
            </div>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="border rounded-xl p-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-semibold">
              2
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-gray-800">
                Upload Signed Receipt
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                After getting it signed, upload the document
              </p>

              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="w-full border rounded-lg px-3 py-2 text-sm mb-3"
              />

              {file && (
                <p className="text-xs text-gray-500 mb-2">
                  Selected: {file.name}
                </p>
              )}

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-indigo-600 text-white rounded-lg py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <UploadCloud size={16}/>
                {uploading ? "Uploading..." : "Upload Signed Receipt"}
              </button>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-sm text-red-500 mb-3">{error}</p>
        )}

        {/* CLOSE BUTTON */}
        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-lg"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}