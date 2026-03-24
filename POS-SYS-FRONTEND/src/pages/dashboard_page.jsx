//dashboard_page.jsx
import React, { useState, useEffect } from "react";
import { Calendar, ScanBarcode, Search, Boxes, CheckCircle2, ShoppingBag, Sparkles, LogOut, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddMachineModal from "../components/modal/AddMachineModal";
import MachineActions from "../components/action/MachineActions";
import ConfirmDeleteModal from "../components/modal/ConfirmDeleteModal";
import AssignMachineModal from "../components/modal/AssignMachineModal";
import EditMachineModal from "../components/modal/EditMachineModal";
import AcknowledgementReceiptModal from "../components/modal/AcknowledgementReceiptModal";
import api from "../api/axios";
import ViewReceiptModal from "../components/modal/ViewReceiptModal";
import { jwtDecode } from "jwt-decode";

const StatusBadge = ({ status }) => {
  const styles = {
    Available: "bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]",
    Sold: "bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]",
    "At Event": "bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE]"
  };
  return <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
};

const FilterButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
      active ? "bg-white shadow border border-[#E5E7EB] text-black" : "text-[#6B7280] hover:text-black"
    }`}
  >
    {label}
  </button>
);

export default function Dashboard() {
  const navigate = useNavigate();

  const [machines, setMachines] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptTarget, setReceiptTarget] = useState(null);

  const [viewReceiptOpen, setViewReceiptOpen] = useState(false);
  const [viewReceiptTarget, setViewReceiptTarget] = useState(null);

  const [viewReceiptMachine, setViewReceiptMachine] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.role === "admin");
    } catch {}
  }, []);

  /* ---------- PHONE FORMAT ---------- */
  const formatPhone = (phone) => {
    if (!phone || phone === "-") return "-";
    const match = phone.match(/^(\+\d{3})(\d+)$/);
    if (!match) return phone;
    return `${match[1]} ${match[2]}`;
  };

  /* ---------- LOAD STORAGE ---------- */
  useEffect(() => {
    console.log("Dashboard mounted");

    const fetchMachines = async () => {
      try {
        const res = await api.get("/machines");
        console.log("Machines:", res.data);
        setMachines(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchMachines();
  }, []);

  /* ---------- ADD MACHINE ---------- */
  const handleAddMachine = async (machine) => {
    try {
      await api.post("/machines", machine);

      const res = await api.get("/machines");
      setMachines(res.data);

      setOpenModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- RETURN ---------- */
  const handleReturnToStock = async (machine) => {
    try {
      await api.post(`/machines/${machine.id}/return`);

      const res = await api.get("/machines");
      setMachines(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssign = (machine) => {
    setAssignTarget(machine);
    setAssignOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const handleDelete = (machine) => {
    setDeleteTarget(machine);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/machines/${deleteTarget.id}`);
      const res = await api.get("/machines");
      setMachines(res.data);

      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleEdit = (machine) => {
    setEditTarget(machine);
    setEditOpen(true);
  };

  const handleSaveEdit = async (updatedMachine) => {
    try {
      await api.put(`/machines/${updatedMachine.id}`, updatedMachine);

      const res = await api.get("/machines");
      setMachines(res.data);

      setEditOpen(false);
      setEditTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignSubmit = async (data) => {
    try {
      if (data.status === "Sold") {
        await api.post(`/machines/${data.id}/sell`, {
          assigned: data.assigned,
          phone: data.phone
        });
      } else {
        await api.post(`/machines/${data.id}/assign`, {
          assigned: data.assigned,
          phone: data.phone,
          event: data.event
        });
      }

      const res = await api.get("/machines");
      setMachines(res.data);

      setAssignOpen(false);
      setAssignTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- RECEIPT ---------- */
  const handleReceipt = (machine) => {
    setReceiptTarget(machine);
    setReceiptOpen(true);
  };

  /* ---------- VIEW RECEIPT ---------- */
  const handleViewReceipt = (machine) => {
    setViewReceiptMachine(machine);
  };
  /* ---------- STATS ---------- */
  const total = machines.length;
  const available = machines.filter(m => m.status === "Available").length;
  const atEvent = machines.filter(m => m.status === "At Event").length;
  const sold = machines.filter(m => m.status === "Sold").length;


  let filteredMachines = machines.filter(m =>
    (filter === "All" || m.status === filter) &&
    (m.id || "").toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="p-8 bg-[#F3F4F6] min-h-screen">

      {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">POS Machines</h1>
            <p className="text-sm text-[#6B7280]">Manage and track your point-of-sale devices</p>
          </div>

          <div className="flex gap-3">
          {isAdmin && (
            <button
              onClick={() => navigate("/logs")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-sm shadow hover:bg-slate-900 transition"
            >
              <ClipboardList size={16}/> Logs
            </button>
          )}

          <button
            onClick={() => navigate("/events")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-sm shadow hover:bg-slate-900 transition"
          >
            <Calendar size={16}/> Events
          </button>

          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm shadow"
          >
            <ScanBarcode size={16}/> Add Machine
          </button>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm shadow transition"
            style={{ backgroundColor: "#DC2626" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#B91C1C"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#DC2626"}
          >
            <LogOut size={16}/> Logout
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Boxes size={18}/>} label="Total Machines" value={total} />
        <StatCard icon={<CheckCircle2 size={18}/>} label="Available" value={available} green />
        <StatCard icon={<ShoppingBag size={18}/>} label="Sold" value={sold} amber />
        <StatCard icon={<Sparkles size={18}/>} label="At Events" value={atEvent} blue />
      </div>

      {/* SEARCH */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16}/>
          <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search by serial number..."
            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-2">
          {["All","Available","Sold","At Event"].map(f => (
            <FilterButton key={f} label={f} active={filter===f} onClick={()=>setFilter(f)} />
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-visible">
        <table className="w-full text-left border-separate border-spacing-0">

          {/* HEADER */}
          <thead className="bg-[#F9FAFB] text-[#6B7280] text-sm">
            <tr>
              <th className="px-5 py-3 rounded-tl-2xl">Serial Number</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Phone Number</th>
              <th className="px-5 py-3">Assigned To</th>
              <th className="px-5 py-3">
                {filter === "Sold" ? "Sold Date" : "Event"}
              </th>
              <th className="px-5 py-3 pr-6 text-right rounded-tr-2xl">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {filteredMachines.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {filter === "Sold"
                        ? "No sold machines"
                        : "No machines available"}
                    </h2>

                    <p className="text-gray-500 text-sm mt-2 max-w-sm">
                      {filter === "Sold"
                        ? "Machines will appear here once they are sold."
                        : "Click Add Machine to register your POS device."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredMachines.map((m, i) => {
                const isLast = i === filteredMachines.length - 1;

                return (
                  <tr
                    key={i}
                    className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC]"
                  >
                    <td className={`px-5 py-4 font-medium ${isLast ? "rounded-bl-2xl" : ""}`}>
                      {m.id}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={m.status} />
                    </td>

                    <td className="px-5 py-4 text-[#6B7280]">
                      {formatPhone(m.phone)}
                    </td>

                    <td className="px-5 py-4">
                      {m.assigned}
                    </td>

                    <td className="px-5 py-4 text-[#6B7280]">
                      {filter === "Sold"
                        ? new Date(m.soldAt).toLocaleDateString()
                        : m.event}
                    </td>

                    <td className={`px-5 py-4 pr-6 text-right ${isLast ? "rounded-br-2xl" : ""}`}>
                      <MachineActions
                        machine={m}
                        onAssign={handleAssign}
                        onReturnToStock={handleReturnToStock}
                        onEdit={handleEdit}
                        onReceipt={handleReceipt}
                        onViewReceipt={handleViewReceipt}
                        onDelete={handleDelete}
                        isAdmin={isAdmin}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

        </table>
      </div>

      <AddMachineModal open={openModal} onClose={()=>setOpenModal(false)} onCreate={handleAddMachine}/>
      <AssignMachineModal open={assignOpen} onClose={()=>setAssignOpen(false)} onAssign={handleAssignSubmit} machine={assignTarget}/>
      <ConfirmDeleteModal open={deleteOpen} onClose={()=>setDeleteOpen(false)} onConfirm={confirmDelete} machine={deleteTarget}/>
      <EditMachineModal open={editOpen} onClose={()=>setEditOpen(false)} onSave={handleSaveEdit} machine={editTarget}/>
      <AcknowledgementReceiptModal open={receiptOpen} onClose={()=>setReceiptOpen(false)} machine={receiptTarget}/>
      <ViewReceiptModal
        open={!!viewReceiptMachine}
        machine={viewReceiptMachine}
        onClose={() => setViewReceiptMachine(null)}
      />
    </div>
  );


function StatCard({ icon, label, value, green, amber, blue }){
  const color = green ? "text-green-600 bg-green-50" : amber ? "text-amber-600 bg-amber-50" : blue ? "text-blue-600 bg-blue-50" : "text-gray-600 bg-gray-100";
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center gap-3 shadow-sm">
      <div className={`p-2 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-xl font-semibold">{value}</p>
        <p className="text-sm text-[#6B7280]">{label}</p>
      </div>
    </div>
  );
}

}
