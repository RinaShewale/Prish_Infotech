import { Bell, Search, User } from "lucide-react";

const AdminHeader = () => (
  <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-[#050505]/50 backdrop-blur-md sticky top-0 z-30">
    <div className="relative w-96">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
      <input 
        className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent/50 transition-colors"
        placeholder="Command Search..."
      />
    </div>
    <div className="flex items-center gap-4">
      <button className="p-2 hover:bg-white/5 rounded-full text-text-secondary hover:text-white transition-colors">
        <Bell className="w-5 h-5" />
      </button>
      <div className="h-8 w-[1px] bg-white/10 mx-2" />
      <div className="flex items-center gap-3 bg-white/5 p-1 pr-4 rounded-full border border-white/10">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-bg font-bold">A</div>
        <span className="text-sm font-medium">Administrator</span>
      </div>
    </div>
  </header>
);
export default AdminHeader;