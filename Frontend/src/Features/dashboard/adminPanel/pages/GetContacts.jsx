import React, { useEffect, useState } from "react";
import { useContact } from "../../../auth/hooks/useContact";
import { GlassCard } from "../Shared/GlassCard";
import { TableSkeleton } from "../Shared/TableSkeleton";
import { Mail, Phone, Trash2, Search, Calendar, Clock } from "lucide-react";
import toast from "react-hot-toast";

const GetContacts = () => {
  const { fetchContacts, handleDeleteContact } = useContact();

  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // 📥 LOAD DATA
  // ======================================================
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetchContacts();

      if (res?.data) {
        setContacts(res.data);
      }

      setLoading(false);
    };

    load();
  }, []);

  // ======================================================
  // 🔍 FILTER DATA
  // ======================================================
  const filtered = contacts?.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.toLowerCase().includes(search.toLowerCase()) ||
    c.inquiryReason?.toLowerCase().includes(search.toLowerCase())
  );

  // ======================================================
  // 🗑 DELETE CONTACT
  // ======================================================
  const handleDelete = async (id) => {
    try {
      const res = await handleDeleteContact(id);

      if (res.success) {
        toast.success("Request deleted successfully");
        setContacts((prev) => prev.filter((c) => c._id !== id));
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-8 pb-20">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold italic tracking-tight">
            Callback Requests
          </h1>
          <p className="text-text-secondary mt-1">
            {contacts?.length || 0} total requests found
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <GlassCard className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />

          <input
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-accent transition-colors text-sm"
            placeholder="Search by name, email, phone or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </GlassCard>

      {/* TABLE */}
      <GlassCard className="p-2 overflow-x-auto">
        <table className="w-full border-collapse">

          <thead>
            <tr className="text-left border-b border-white/5 bg-white/[0.01]">
              <th className="p-6 text-[10px] uppercase text-text-secondary font-bold">
                User
              </th>
              <th className="p-6 text-[10px] uppercase text-text-secondary font-bold">
                Contact Info
              </th>
              <th className="p-6 text-[10px] uppercase text-text-secondary font-bold">
                Schedule
              </th>
              <th className="p-6 text-[10px] uppercase text-text-secondary font-bold">
                Reason
              </th>
              <th className="p-6 text-[10px] uppercase text-text-secondary font-bold text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <TableSkeleton rows={6} cols={5} />
            ) : (
              filtered?.map((c) => (
                <tr
                  key={c._id}
                  className="border-b border-white/5 hover:bg-white/[0.01] transition-colors"
                >

                  {/* NAME */}
                  <td className="p-6">
                    <p className="text-sm font-bold text-white">
                      {c.name}
                    </p>
                    <p className="text-[11px] text-text-secondary">
                      Callback Request
                    </p>
                  </td>

                  {/* CONTACT */}
                  <td className="p-6">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Mail className="w-3 h-3" />
                        {c.email}
                      </div>

                      <div className="flex items-center gap-2 text-text-secondary">
                        <Phone className="w-3 h-3" />
                        {c.phone}
                      </div>
                    </div>
                  </td>

                  {/* SCHEDULE */}
                  <td className="p-6 text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {c.preferredDate}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3" />
                      {c.preferredTime}
                    </div>
                  </td>

                  {/* REASON */}
                  <td className="p-6 text-sm text-text-secondary max-w-[200px]">
                    {c.inquiryReason}
                  </td>

                  {/* ACTION */}
                  <td className="p-6 text-right">
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>

        {!loading && filtered?.length === 0 && (
          <div className="p-20 text-center text-text-secondary text-sm">
            No callback requests found.
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default GetContacts;