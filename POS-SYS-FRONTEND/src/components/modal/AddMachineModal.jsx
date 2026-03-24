//AddMachineModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { X, ScanLine } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

export default function AddMachineModal({ open, onClose, onCreate }) {

  const GCC_COUNTRIES = [
    { name: "Qatar", code: "+974", digits: 8 },
    { name: "UAE", code: "+971", digits: 9 },
    { name: "Saudi Arabia", code: "+966", digits: 9 },
    { name: "Kuwait", code: "+965", digits: 8 },
    { name: "Oman", code: "+968", digits: 8 },
    { name: "Bahrain", code: "+973", digits: 8 },
  ];

  const [serial, setSerial] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState(GCC_COUNTRIES[0]);
  const [errors, setErrors] = useState({ serial: "", phone: "" });

  const [scanning, setScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const qrInstance = useRef(null);
  const scannedRef = useRef(false);

  /* ---------- PHONE VALIDATION ---------- */
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > country.digits) value = value.slice(0, country.digits);
    setPhone(value);
    setErrors(prev => ({ ...prev, phone: "" }));
  };

  useEffect(() => {
    if (!open) return;
    setErrors({ serial: "", phone: "" });
  }, [open]);

  /* ---------- QR SCANNER ---------- */
  const openScanner = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      setCameras(devices);
      setScanning(true);
      if (devices.length > 0) setSelectedCamera(devices[0].id);
    } catch {
      setErrors(prev => ({ ...prev, serial: "Camera permission denied" }));
    }
  };

  useEffect(() => {
    if (!selectedCamera || !scanning) return;

    const qr = new Html5Qrcode("qr-reader");
    qrInstance.current = qr;
    scannedRef.current = false;

    qr.start(
      selectedCamera,
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        if (scannedRef.current) return;
        scannedRef.current = true;
        await destroyScanner();
        setSerial(decodedText);
        setErrors(prev => ({ ...prev, serial: "" }));
        setScanning(false);
      },
      () => {}
    );
  }, [selectedCamera, scanning]);

  const destroyScanner = async () => {
    try {
      if (qrInstance.current) {
        const state = qrInstance.current.getState?.();
        if (state === 2) await qrInstance.current.stop();
        await qrInstance.current.clear();
        qrInstance.current = null;
      }
    } catch {}
  };

  const stopScanner = async () => {
    await destroyScanner();
    setScanning(false);
  };

  /* ---------- CREATE MACHINE ---------- */
  const handleCreate = () => {
    let hasError = false;
    const newErrors = { serial: "", phone: "" };

    if (!serial.trim()) {
      newErrors.serial = "Serial number is required";
      hasError = true;
    }

    if (!phone) {
      newErrors.phone = "Phone number is required";
      hasError = true;
    } else if (phone.length !== country.digits) {
      newErrors.phone = `${country.name} number must be ${country.digits} digits`;
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    onCreate({
      id: serial.trim(),
      status: "Available",
      phone: `${country.code}${phone}`,
      assigned: "-",
      event: "-" // keep dashboard compatibility
    });

    setSerial("");
    setPhone("");
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-[420px] rounded-2xl shadow-xl p-6 relative">

          <button onClick={onClose} className="absolute right-4 top-4 text-gray-400">
            <X size={20}/>
          </button>

          <h2 className="text-lg font-semibold mb-6">Add POS Machine</h2>

          {/* SERIAL */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">Serial Number</label>
            <div className="flex gap-2">
              <input
                value={serial}
                onChange={(e)=>{ setSerial(e.target.value); setErrors(prev=>({...prev, serial:""})) }}
                className={`flex-1 border rounded-lg px-3 py-2.5 text-sm ${errors.serial ? 'border-red-400' : ''}`}
                placeholder="Scan or enter serial"
              />
              <button onClick={openScanner} className="px-3 rounded-lg border hover:bg-gray-50 flex items-center">
                <ScanLine size={18}/>
              </button>
            </div>
            {errors.serial && <p className="text-xs text-red-500 mt-1">{errors.serial}</p>}
          </div>

          {/* PHONE */}
          <div className="mb-6">
            <label className="text-sm text-gray-600 mb-1 block">Phone Number</label>
            <div className="flex gap-2">
              <select
                value={country.code}
                onChange={(e)=>{ 
                  const selected = GCC_COUNTRIES.find(c=>c.code===e.target.value); 
                  setCountry(selected); 
                  setPhone(""); 
                  setErrors(prev=>({...prev, phone:""})); 
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
                className={`flex-1 border rounded-lg px-3 py-2.5 text-sm ${errors.phone ? 'border-red-400' : ''}`}
                placeholder={`Enter ${country.digits} digit number`}
              />
            </div>

            {errors.phone ? (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">Must be exactly {country.digits} digits</p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 border rounded-lg py-2.5 text-sm">Cancel</button>
            <button onClick={handleCreate} className="flex-1 bg-indigo-600 text-white rounded-lg py-2.5 text-sm">Add Machine</button>
          </div>

        </div>
      </div>

      {/* QR SCANNER */}
      {scanning && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999]">
          <div className="bg-white rounded-2xl p-4 w-[340px]">
            <h3 className="font-semibold mb-2">Scan Serial</h3>

            <select className="w-full border rounded-lg p-2 mb-3 text-sm"
              value={selectedCamera || ""}
              onChange={(e)=>setSelectedCamera(e.target.value)}
            >
              {cameras.map(cam => (
                <option key={cam.id} value={cam.id}>{cam.label || `Camera ${cam.id}`}</option>
              ))}
            </select>

            <div id="qr-reader" className="rounded-lg overflow-hidden"/>

            <button onClick={stopScanner} className="mt-3 w-full py-2 rounded-lg border text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
