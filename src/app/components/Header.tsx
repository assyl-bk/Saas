import { Bell, Command, Settings, Search, Moon, Sun, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  return (
    <motion.header
      className={`backdrop-blur-xl sticky top-0 z-50 transition-colors ${
        theme === 'dark' 
          ? 'bg-white/5 border-b border-white/10' 
          : 'bg-white/80 border-b border-gray-200'
      }`}
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
            <h1 className={`text-lg font-bold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Energy Forecast</h1>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-foreground-secondary' : 'text-gray-600'
            }`}>Probabilistic Demand Forecasting System</p>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative group">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              theme === 'dark' ? 'text-muted-foreground' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search..."
              className={`w-full rounded-lg pl-10 pr-12 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all ${
                theme === 'dark'
                  ? 'bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground'
                  : 'bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400'
              }`}
            />
            <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded ${
              theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'
            }`}>
              <Command className={`w-3 h-3 ${
                theme === 'dark' ? 'text-muted-foreground' : 'text-gray-400'
              }`} />
              <span className={`text-xs ${
                theme === 'dark' ? 'text-muted-foreground' : 'text-gray-400'
              }`}>K</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </motion.button>

          <motion.button
            className={`relative p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className={`w-5 h-5 ${
              theme === 'dark' ? 'text-foreground-secondary' : 'text-gray-600'
            }`} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-critical rounded-full animate-glow" />
          </motion.button>

          <motion.button
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className={`w-5 h-5 ${
              theme === 'dark' ? 'text-foreground-secondary' : 'text-gray-600'
            }`} />
          </motion.button>

          <div className="relative">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-[#2563EB] flex items-center justify-center text-white text-sm font-semibold border-2 border-white/20">
                  {user?.name?.substring(0, 2).toUpperCase() || 'JD'}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-[#0A1628]" />
              </div>
            </motion.button>

            {/* User Menu Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute right-0 top-full mt-2 w-64 rounded-xl shadow-2xl overflow-hidden z-50 ${
                      theme === 'dark'
                        ? 'bg-[#111827] border border-white/10'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className={`p-4 border-b ${
                      theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[#2563EB] flex items-center justify-center text-white text-lg font-semibold">
                          {user?.name?.substring(0, 2).toUpperCase() || 'JD'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {user?.name || 'John Doe'}
                          </p>
                          <p className="text-xs text-foreground-secondary truncate">
                            {user?.email || 'john@example.com'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <button
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-white/5 text-foreground-secondary hover:text-white'
                            : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">Profile Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-red-500/10 text-foreground-secondary hover:text-red-400'
                            : 'hover:bg-red-50 text-gray-600 hover:text-red-600'
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
