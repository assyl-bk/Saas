import { useState } from "react";
import { GlassCard } from "./GlassCard";
import { Upload, Search, Download, Eye, Edit, Trash2, CheckCircle, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Dataset {
  id: string;
  name: string;
  type: string;
  records: string;
  lastUpdated: string;
  quality: number;
}

const mockDatasets: Dataset[] = [
  { id: "1", name: "Historical Load 2023-2025", type: "Time Series", records: "1,250,000", lastUpdated: "2 hours ago", quality: 98 },
  { id: "2", name: "Weather Data - Regional", type: "Weather", records: "890,000", lastUpdated: "1 day ago", quality: 95 },
  { id: "3", name: "Demand Forecast Archive", type: "Forecast", records: "2,100,000", lastUpdated: "3 hours ago", quality: 97 },
  { id: "4", name: "Grid Topology Data", type: "Infrastructure", records: "45,000", lastUpdated: "1 week ago", quality: 92 },
  { id: "5", name: "Real-Time Sensor Feed", type: "Streaming", records: "Live", lastUpdated: "Live", quality: 99 },
];

export function DataPage() {
  const [datasets, setDatasets] = useState(mockDatasets);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const filteredDatasets = datasets.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Mock file upload
    console.log("Files dropped");
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 95) return "text-success";
    if (quality >= 85) return "text-warning";
    return "text-critical";
  };

  const getQualityBg = (quality: number) => {
    if (quality >= 95) return "bg-success/20 border-success/30";
    if (quality >= 85) return "bg-warning/20 border-warning/30";
    return "bg-critical/20 border-critical/30";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Data Sources</h2>
          <p className="text-sm text-foreground-secondary">
            Manage datasets and upload new data for forecasting
          </p>
        </div>
        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-[#2563EB] hover:shadow-lg hover:shadow-primary/30 text-white font-semibold transition-all flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Dataset
        </button>
      </div>

      {/* Search and Filters */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search datasets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>All Types</option>
            <option>Time Series</option>
            <option>Weather</option>
            <option>Forecast</option>
          </select>
          <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>Sort by: Recent</option>
            <option>Name (A-Z)</option>
            <option>Quality</option>
          </select>
        </div>
      </GlassCard>

      {/* Upload Zone */}
      {datasets.length === 0 && (
        <motion.div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            isDragging ? "border-primary bg-primary/10" : "border-white/20 bg-white/5"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-primary/30">
            <Upload className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Upload Your Dataset</h3>
          <p className="text-foreground-secondary mb-4">
            Drag & drop your CSV or Excel files here
          </p>
          <button className="px-6 py-3 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary font-medium transition-colors border border-primary/30">
            or click to browse
          </button>
          <p className="text-xs text-muted-foreground mt-4">
            Supported formats: CSV, XLSX, JSON (Max 500MB)
          </p>
        </motion.div>
      )}

      {/* Data Table */}
      {filteredDatasets.length > 0 && (
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                    Records
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                    Quality
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDatasets.map((dataset, index) => (
                  <motion.tr
                    key={dataset.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-primary/30">
                          <span className="text-sm font-semibold text-primary">
                            {dataset.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{dataset.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {dataset.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-foreground-secondary border border-white/20">
                        {dataset.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-white">{dataset.records}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground-secondary">{dataset.lastUpdated}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              dataset.quality >= 95 ? "bg-success" : dataset.quality >= 85 ? "bg-warning" : "bg-critical"
                            }`}
                            style={{ width: `${dataset.quality}%` }}
                          />
                        </div>
                        <span className={`text-sm font-semibold ${getQualityColor(dataset.quality)}`}>
                          {dataset.quality}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedDataset(dataset)}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
                        >
                          <Eye className="w-4 h-4 text-foreground-secondary group-hover:text-primary" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors group">
                          <Download className="w-4 h-4 text-foreground-secondary group-hover:text-success" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors group">
                          <Edit className="w-4 h-4 text-foreground-secondary group-hover:text-warning" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors group">
                          <Trash2 className="w-4 h-4 text-foreground-secondary group-hover:text-critical" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {selectedDataset && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDataset(null)}
          >
            <motion.div
              className="w-full max-w-5xl max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="p-0">
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{selectedDataset.name}</h3>
                    <p className="text-sm text-foreground-secondary">Dataset Preview & Statistics</p>
                  </div>
                  <button
                    onClick={() => setSelectedDataset(null)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-foreground-secondary" />
                  </button>
                </div>

                {/* Statistics Grid */}
                <div className="px-8 py-6 grid grid-cols-4 gap-4 border-b border-white/10">
                  <div>
                    <p className="text-xs text-foreground-secondary mb-1">Mean</p>
                    <p className="text-lg font-mono font-semibold text-white">8,234.5</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-secondary mb-1">Median</p>
                    <p className="text-lg font-mono font-semibold text-white">8,190.2</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-secondary mb-1">Std Dev</p>
                    <p className="text-lg font-mono font-semibold text-white">342.8</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-secondary mb-1">Missing</p>
                    <p className="text-lg font-mono font-semibold text-success">0.2%</p>
                  </div>
                </div>

                {/* Sample Data Table */}
                <div className="px-8 py-6 overflow-auto max-h-[400px]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-[#111827]/95 backdrop-blur-xl">
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-foreground-secondary">Timestamp</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-foreground-secondary">Load (MW)</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-foreground-secondary">Temperature (°C)</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-foreground-secondary">Humidity (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 20 }, (_, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-4 font-mono text-foreground-secondary">
                            2026-02-{String(5 - Math.floor(i / 24)).padStart(2, "0")} {String(23 - (i % 24)).padStart(2, "0")}:00
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-white">
                            {(8000 + Math.random() * 1000).toFixed(1)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-white">
                            {(20 + Math.random() * 10).toFixed(1)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-white">
                            {(50 + Math.random() * 30).toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-6 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-sm text-foreground-secondary">
                      Data quality: <span className="text-success font-semibold">{selectedDataset.quality}%</span>
                    </span>
                  </div>
                  <button className="px-6 py-3 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary font-medium transition-colors border border-primary/30">
                    Apply Preprocessing
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
