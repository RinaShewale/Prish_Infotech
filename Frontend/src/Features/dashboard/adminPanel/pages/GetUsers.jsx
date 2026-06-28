import React, { useEffect, useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { GlassCard } from '../Shared/GlassCard';
import { TableSkeleton } from '../Shared/TableSkeleton';
import { blockUser } from '../services/admin.api';
import { UserX, ShieldCheck, Mail, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const GetUsers = () => {
  const { users, loading, fetchUsers } = useAdmin();
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleBlock = async (id) => {
    try {
      await blockUser(id);
      toast.success("User status updated");
      fetchUsers();
    } catch (err) { toast.error("Action failed"); }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold italic tracking-tight">Student Management</h1>
          <p className="text-text-secondary mt-1">{users.length} total registered students.</p>
        </div>
      </div>

      {/* Search */}
      <GlassCard className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-accent transition-colors text-sm"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </GlassCard>

      <GlassCard className="p-2 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-white/5 bg-white/[0.01]">
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold">Student</th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold">Joined</th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold">Courses</th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold">Status</th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <TableSkeleton rows={8} cols={5} /> : filtered.map((user) => (
              <tr key={user._id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=926868&color=fff`} className="w-10 h-10 rounded-full grayscale group-hover:grayscale-0 transition-all" alt="" />
                    <div>
                      <p className="text-sm font-bold">{user.name}</p>
                      <p className="text-[11px] text-text-secondary">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-sm text-text-secondary">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="p-6 text-sm font-medium">{user.purchasedCourses?.length || 0}</td>
                <td className="p-6">
                  <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold border ${user.isBlocked ? 'border-red-500/20 text-red-500 bg-red-500/5' : 'border-green-500/20 text-green-500 bg-green-500/5'}`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-text-secondary hover:text-white transition-colors"><Mail className="w-4 h-4" /></button>
                    <button onClick={() => handleBlock(user._id)} className={`p-2 rounded-lg transition-colors ${user.isBlocked ? 'text-green-400 bg-green-400/10' : 'text-red-400 hover:bg-red-400/10'}`}>
                      {user.isBlocked ? <ShieldCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
};
export default GetUsers;