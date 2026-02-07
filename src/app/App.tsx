import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { ForecastPage } from "./components/ForecastPage";
import { DataPage } from "./components/DataPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { SettingsPage } from "./components/SettingsPage";
import { CommandPalette } from "./components/CommandPalette";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "forecast":
        return <ForecastPage />;
      case "data":
        return <DataPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] to-[#111827] text-white">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10">
        <Header />
        <div className="flex">
          <Sidebar activePage={currentPage} onPageChange={setCurrentPage} />
          <main className="flex-1 ml-[280px] p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(page) => {
          setCurrentPage(page);
          setIsCommandPaletteOpen(false);
        }}
      />
    </div>
  );
}