import { useState } from "react";
import { GlassCard } from "./GlassCard";
import { Calendar, Download, Share2, Settings, Zap } from "lucide-react";
import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Mock data for preview
const generatePreviewData = () => {
  const data = [];
  const now = new Date();
  for (let i = 0; i < 72; i++) {
    const time = new Date(now.getTime() + i * 60 * 60000);
    const baseLoad = 8000 + Math.sin(i / 12) * 1200;
    data.push({
      time: time.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit" }),
      p5: baseLoad - 800,
      p25: baseLoad - 300,
      p50: baseLoad,
      p75: baseLoad + 300,
      p95: baseLoad + 800,
    });
  }
  return data;
};

const quantileOptions = ["5%", "25%", "50%", "75%", "95%", "Custom"];

export function ForecastPage() {
  const [horizon, setHorizon] = useState<"24h" | "48h" | "72h">("48h");
  const [selectedQuantiles, setSelectedQuantiles] = useState(["50%", "95%"]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  const toggleQuantile = (quantile: string) => {
    setSelectedQuantiles((prev) =>
      prev.includes(quantile) ? prev.filter((q) => q !== quantile) : [...prev, quantile]
    );
  };

  const previewData = generatePreviewData();

  return (
    <div className="grid grid-cols-[35%_1fr] gap-6 h-[calc(100vh-180px)]">
      {/* Left Panel - Configuration */}
      <div className="space-y-6 overflow-y-auto pr-2">
        <GlassCard>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">New Forecast</h2>
            <p className="text-sm text-foreground-secondary">
              Configure parameters and generate energy predictions
            </p>
          </div>

          {/* Time Horizon */}
          <div className="space-y-3 mb-6">
            <label className="text-sm font-semibold text-white">Time Horizon</label>
            <div className="grid grid-cols-3 gap-2">
              {(["24h", "48h", "72h"] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                    horizon === h
                      ? "bg-primary text-white shadow-lg shadow-primary/30 border border-primary/50"
                      : "bg-white/5 text-foreground-secondary hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {h.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-3 mb-6">
            <label className="text-sm font-semibold text-white">Start Date & Time</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="datetime-local"
                defaultValue={new Date().toISOString().slice(0, 16)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Quantiles */}
          <div className="space-y-3 mb-6">
            <label className="text-sm font-semibold text-white">Prediction Quantiles</label>
            <div className="grid grid-cols-3 gap-2">
              {quantileOptions.map((q) => (
                <button
                  key={q}
                  onClick={() => toggleQuantile(q)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    selectedQuantiles.includes(q)
                      ? "bg-primary/20 text-primary border border-primary/50"
                      : "bg-white/5 text-foreground-secondary hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Selected: {selectedQuantiles.join(", ")}
            </p>
          </div>

          {/* Advanced Options */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Advanced Options
              <span className="ml-auto">{showAdvanced ? "−" : "+"}</span>
            </button>
            
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4 pt-2"
              >
                <div>
                  <label className="text-xs text-foreground-secondary mb-2 block">
                    Confidence Interval Width
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    defaultValue="95"
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Narrow</span>
                    <span>Wide</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-foreground-secondary mb-2 block">
                    Include Weather Features
                  </label>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 px-3 rounded-lg bg-primary/20 text-primary border border-primary/50 text-xs font-medium">
                      Yes
                    </button>
                    <button className="flex-1 py-2 px-3 rounded-lg bg-white/5 text-foreground-secondary border border-white/10 text-xs font-medium">
                      No
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-[#2563EB] hover:shadow-lg hover:shadow-primary/30 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Generate Forecast
              </>
            )}
          </button>
        </GlassCard>

        {/* System Info */}
        <GlassCard className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
          <h3 className="text-sm font-semibold text-white mb-2">System Status</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Last Update:</span>
              <span className="text-white font-mono">Feb 7, 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-secondary">System Status:</span>
              <span className="text-success font-mono">Operational</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Available Data:</span>
              <span className="text-white font-mono">24M records</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Right Panel - Preview */}
      <GlassCard className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Forecast Preview</h3>
            <p className="text-sm text-foreground-secondary">
              {generated ? `${horizon.toUpperCase()} prediction with ${selectedQuantiles.length} quantiles` : "Configure and generate your forecast"}
            </p>
          </div>
          
          {generated && (
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Download className="w-5 h-5 text-foreground-secondary" />
              </button>
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Share2 className="w-5 h-5 text-foreground-secondary" />
              </button>
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Settings className="w-5 h-5 text-foreground-secondary" />
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center">
          {!generated && !generating && (
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-primary/30">
                <Zap className="w-12 h-12 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Ready to Generate</h4>
              <p className="text-sm text-foreground-secondary max-w-md mx-auto">
                Configure your forecast parameters on the left and click "Generate Forecast" to create predictions
              </p>
            </div>
          )}

          {generating && (
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-primary/30 animate-pulse">
                <Zap className="w-12 h-12 text-primary animate-glow" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Generating Forecast...</h4>
              <p className="text-sm text-foreground-secondary">
                Processing historical data and patterns
              </p>
            </div>
          )}

          {generated && (
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={previewData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="time"
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF", fontSize: 11 }}
                    interval={11}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF", fontSize: 11 }}
                    label={{ value: "Load (MW)", angle: -90, position: "insideLeft", fill: "#9CA3AF" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      backdropFilter: "blur(12px)",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#D1D5DB" }} />
                  {selectedQuantiles.includes("5%") && (
                    <Line type="monotone" dataKey="p5" stroke="#F59E0B" strokeWidth={1} dot={false} name="5th Percentile" />
                  )}
                  {selectedQuantiles.includes("25%") && (
                    <Line type="monotone" dataKey="p25" stroke="#10B981" strokeWidth={1} dot={false} name="25th Percentile" />
                  )}
                  {selectedQuantiles.includes("50%") && (
                    <Line type="monotone" dataKey="p50" stroke="#3B82F6" strokeWidth={3} dot={false} name="Median (50th)" />
                  )}
                  {selectedQuantiles.includes("75%") && (
                    <Line type="monotone" dataKey="p75" stroke="#8B5CF6" strokeWidth={1} dot={false} name="75th Percentile" />
                  )}
                  {selectedQuantiles.includes("95%") && (
                    <Line type="monotone" dataKey="p95" stroke="#F43F5E" strokeWidth={1} dot={false} name="95th Percentile" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}