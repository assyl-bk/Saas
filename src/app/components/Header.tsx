import { Bell, Command, Settings, Search } from "lucide-react";
import { motion } from "motion/react";

export function Header() {
  return (
    <motion.header
      className="backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-[#2563EB] flex items-center justify-center shadow-lg shadow-primary/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="white" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Forecast Intelligence</h1>
            <p className="text-xs text-foreground-secondary">Enterprise Energy Platform</p>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-12 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10">
              <Command className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">K</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <motion.button
            className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5 text-foreground-secondary" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-critical rounded-full animate-glow" />
          </motion.button>

          <motion.button
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-5 h-5 text-foreground-secondary" />
          </motion.button>

          <div className="relative">
            <motion.button
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-[#2563EB] flex items-center justify-center text-white text-sm font-semibold border-2 border-white/20">
                  JD
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-[#0A1628]" />
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
