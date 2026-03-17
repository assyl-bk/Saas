import { useState, useEffect } from "react";
import { GlassCard } from "./GlassCard";
import { Calendar, Download, Share2, Settings, Zap, AlertTriangle, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart, ReferenceLine } from "recharts";
import { useTheme } from "../context/ThemeContext";

// Generate realistic energy demand data with quantile predictions
const generateEnergyForecastData = (customQuantile: number) => {
  const data = [];
  const now = new Date();
  const historicalHours = 24; // Past 24 hours
  const forecastHours = 48; // Next 48 hours for forecasting
  
  for (let i = -historicalHours; i < forecastHours; i++) {
    const time = new Date(now.getTime() + i * 60 * 60000);
    const hour = time.getHours();
    const dayOfWeek = time.getDay();
    
    // More realistic energy demand pattern: Lower at night, peaks during day
    let baseLoad = 7000;
    
    // Daily pattern
    if (hour >= 6 && hour < 9) baseLoad += 2000; // Morning peak
    else if (hour >= 9 && hour < 17) baseLoad += 2500; // Business hours
    else if (hour >= 17 && hour < 21) baseLoad += 3000; // Evening peak
    else if (hour >= 21 || hour < 6) baseLoad -= 1000; // Night valley
    
    // Weekend adjustment
    if (dayOfWeek === 0 || dayOfWeek === 6) baseLoad *= 0.85;
    
    // Add some randomness
    baseLoad += (Math.sin(i / 6) * 400) + (Math.random() - 0.5) * 300;
    
    // Calculate quantile-based prediction bounds
    const quantileFactor = (customQuantile - 50) / 50; // -1 to 1
    const uncertainty = 600 + Math.abs(i) * 15; // Uncertainty grows with time
    const customPrediction = baseLoad + (quantileFactor * uncertainty);
    
    const entry: any = {
      time: time.toLocaleString("en-US", { 
        month: "short", 
        day: "numeric", 
        hour: "2-digit",
        hour12: false 
      }),
      actual: i < 0 ? baseLoad : null, // Historical data
      forecast: i >= 0 ? baseLoad : null, // Median forecast
      lower5: i >= 0 ? baseLoad - uncertainty * 1.5 : null,
      lower25: i >= 0 ? baseLoad - uncertainty * 0.8 : null,
      upper75: i >= 0 ? baseLoad + uncertainty * 0.8 : null,
      upper95: i >= 0 ? baseLoad + uncertainty * 1.5 : null,
      customQuantile: i >= 0 ? customPrediction : null,
      capacityThreshold: 11000, // Grid capacity threshold
    };
    
    data.push(entry);
  }
  return data;
};

const quantileOptions = ["5%", "25%", "50%", "75%", "95%"];

export function ForecastPage() {
  const { theme } = useTheme();
  const [horizon, setHorizon] = useState<"24h" | "48h" | "72h">("48h");
  const [selectedQuantiles, setSelectedQuantiles] = useState(["50%", "95%"]);
  const [customQuantile, setCustomQuantile] = useState(75); // Custom quantile value (0-100)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generated, setGenerated] = useState(true); // Start with generated view
  const [generating, setGenerating] = useState(false);
  const [realTimeUpdate, setRealTimeUpdate] = useState(true);
  const [forecastData, setForecastData] = useState(generateEnergyForecastData(75));

  // Real-time data update simulation
  useEffect(() => {
    if (realTimeUpdate && generated) {
      const interval = setInterval(() => {
        setForecastData(generateEnergyForecastData(customQuantile));
      }, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [realTimeUpdate, generated, customQuantile]);

  // Update forecast when custom quantile changes
  useEffect(() => {
    if (generated) {
      setForecastData(generateEnergyForecastData(customQuantile));
    }
  }, [customQuantile, generated]);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setForecastData(generateEnergyForecastData(customQuantile));
    }, 2000);
  };

  const toggleQuantile = (quantile: string) => {
    setSelectedQuantiles((prev) =>
      prev.includes(quantile) ? prev.filter((q) => q !== quantile) : [...prev, quantile]
    );
  };

  // Check if forecast exceeds capacity threshold
  const hasCapacityAlert = forecastData.some(d => d.customQuantile && d.customQuantile > d.capacityThreshold);

  return (
    <div className="grid grid-cols-[35%_1fr] gap-6 h-[calc(100vh-180px)]">
      {/* Left Panel - Configuration */}
      <div className="space-y-6 overflow-y-auto pr-2">
        <GlassCard>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Energy Demand Forecast</h2>
            <p className="text-sm text-foreground-secondary">
              Configure quantile parameters for probabilistic predictions
            </p>
          </div>

          {/* Custom Quantile Control - PRIMARY FEATURE */}
          <div className="space-y-4 mb-6 p-4 rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/30">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Custom Quantile Prediction</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{customQuantile}%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="99"
                step="1"
                value={customQuantile}
                onChange={(e) => setCustomQuantile(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider-thumb"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${customQuantile}%, rgba(255,255,255,0.1) ${customQuantile}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Lower Bound (1%)</span>
                <span>Median (50%)</span>
                <span>Upper Bound (99%)</span>
              </div>
            </div>
            
            <div className="text-xs text-foreground-secondary">
              {customQuantile < 50 
                ? `${customQuantile}% chance demand will be above this level (conservative estimate)`
                : customQuantile === 50 
                ? "Median prediction - 50% chance above/below this level"
                : `${100 - customQuantile}% chance demand will be above this level (optimistic estimate)`
              }
            </div>
          </div>

          {/* Capacity Alert */}
          {hasCapacityAlert && generated && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-400 mb-1">Capacity Threshold Alert</h4>
                <p className="text-xs text-red-300/80">
                  Predicted demand may exceed grid capacity at quantile {customQuantile}%. Consider load management strategies.
                </p>
              </div>
            </motion.div>
          )}

          {/* Time Horizon */}
          <div className="space-y-3 mb-6">
            <label className="text-sm font-semibold text-foreground">Time Horizon</label>
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
            <label className="text-sm font-semibold text-foreground">Start Date & Time</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="datetime-local"
                defaultValue={new Date().toISOString().slice(0, 16)}
                className={`w-full rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all ${
                  theme === 'dark' 
                    ? 'bg-white/5 border border-white/10 text-white' 
                    : 'bg-white border border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>

          {/* Standard Quantile Overlays */}
          <div className="space-y-3 mb-6">
            <label className="text-sm font-semibold text-foreground">Additional Quantile Overlays</label>
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
              Show additional uncertainty bounds: {selectedQuantiles.join(", ")}
            </p>
          </div>

          {/* Real-time Update Toggle */}
          <div className="space-y-3 mb-6">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              Real-time Updates
              <span className="text-xs text-muted-foreground font-normal">(simulated)</span>
            </label>
            <button
              onClick={() => setRealTimeUpdate(!realTimeUpdate)}
              className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                realTimeUpdate
                  ? "bg-green-500/20 text-green-400 border border-green-500/50"
                  : "bg-white/5 text-foreground-secondary border border-white/10"
              }`}
            >
              {realTimeUpdate ? "● Live Updates (every 5s)" : "○ Updates Paused"}
            </button>
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
                    Grid Capacity Threshold (MW)
                  </label>
                  <input
                    type="number"
                    defaultValue="11000"
                    className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      theme === 'dark' 
                        ? 'bg-white/5 border border-white/10 text-white' 
                        : 'bg-white border border-gray-300 text-gray-900'
                    }`}
                  />
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

                <div>
                  <label className="text-xs text-foreground-secondary mb-2 block">
                    Seasonality Detection
                  </label>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 px-3 rounded-lg bg-primary/20 text-primary border border-primary/50 text-xs font-medium">
                      Auto
                    </button>
                    <button className="flex-1 py-2 px-3 rounded-lg bg-white/5 text-foreground-secondary border border-white/10 text-xs font-medium">
                      Manual
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
                Regenerate Forecast
              </>
            )}
          </button>
        </GlassCard>

        {/* System Info */}
        <GlassCard className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
          <h3 className="text-sm font-semibold text-foreground mb-3">System Status</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Model Version:</span>
              <span className="text-foreground font-mono">v2.4.1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Last Training:</span>
              <span className="text-foreground font-mono">Feb 18, 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Grid Status:</span>
              <span className="text-green-400 font-mono">● Operational</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Data Points:</span>
              <span className="text-foreground font-mono">2.4M records</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Forecast Accuracy:</span>
              <span className="text-foreground font-mono">94.2%</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Right Panel - Forecast Chart */}
      <GlassCard className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              Energy Demand Forecast - {horizon.toUpperCase()}
            </h3>
            <p className="text-sm text-foreground-secondary">
              {generated 
                ? `Quantile ${customQuantile}% prediction with ${realTimeUpdate ? 'real-time' : 'static'} updates` 
                : "Configure parameters and generate forecast"}
            </p>
          </div>
          
          {generated && (
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
                <Download className="w-5 h-5 text-foreground-secondary group-hover:text-white" />
              </button>
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
                <Share2 className="w-5 h-5 text-foreground-secondary group-hover:text-white" />
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
              <h4 className="text-lg font-semibold text-foreground mb-2">Ready to Forecast</h4>
              <p className="text-sm text-foreground-secondary max-w-md mx-auto">
                Adjust the custom quantile slider and configure parameters to generate probabilistic energy demand predictions
              </p>
            </div>
          )}

          {generating && (
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-primary/30 animate-pulse">
                <Zap className="w-12 h-12 text-primary animate-glow" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Generating Forecast...</h4>
              <p className="text-sm text-foreground-secondary">
                Processing historical demand patterns and applying quantile regression
              </p>
            </div>
          )}

          {generated && (
            <div className="w-full h-full flex flex-col">
              {/* Forecast Statistics */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-xs text-foreground-secondary mb-1">Peak Demand</div>
                  <div className="text-lg font-bold text-foreground flex items-center gap-1">
                    {Math.max(...forecastData.filter(d => d.customQuantile).map(d => d.customQuantile)).toFixed(0)}
                    <span className="text-xs text-muted-foreground">MW</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-xs text-foreground-secondary mb-1">Avg Demand</div>
                  <div className="text-lg font-bold text-foreground flex items-center gap-1">
                    {(forecastData.filter(d => d.customQuantile).reduce((a, b) => a + b.customQuantile, 0) / 
                      forecastData.filter(d => d.customQuantile).length).toFixed(0)}
                    <span className="text-xs text-muted-foreground">MW</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-xs text-foreground-secondary mb-1">Current Quantile</div>
                  <div className="text-lg font-bold text-primary flex items-center gap-1">
                    {customQuantile}
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-xs text-foreground-secondary mb-1">Risk Level</div>
                  <div className={`text-lg font-bold ${hasCapacityAlert ? 'text-red-400' : 'text-green-400'}`}>
                    {hasCapacityAlert ? 'High' : 'Normal'}
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorCustom" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
                    />
                    <XAxis
                      dataKey="time"
                      stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                      tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#4B5563', fontSize: 10 }}
                      interval={8}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                      tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#4B5563', fontSize: 11 }}
                      label={{ 
                        value: "Demand (MW)", 
                        angle: -90, 
                        position: "insideLeft", 
                        fill: theme === 'dark' ? '#9CA3AF' : '#4B5563' 
                      }}
                      domain={[6000, 13000]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
                        borderRadius: "8px",
                        backdropFilter: "blur(12px)",
                        color: theme === 'dark' ? '#FFFFFF' : '#111827',
                      }}
                      formatter={(value: any) => [`${value.toFixed(0)} MW`, ""]}
                    />
                    <Legend 
                      wrapperStyle={{ 
                        color: theme === 'dark' ? '#D1D5DB' : '#4B5563', 
                        fontSize: 12 
                      }} 
                    />
                    
                    {/* Capacity Threshold Line */}
                    <ReferenceLine 
                      y={11000} 
                      stroke="#EF4444" 
                      strokeDasharray="5 5" 
                      strokeWidth={2}
                      label={{ value: "Capacity Limit", fill: "#EF4444", fontSize: 11 }}
                    />
                    
                    {/* Uncertainty bands (optional overlays) */}
                    {selectedQuantiles.includes("95%") && (
                      <>
                        <Area type="monotone" dataKey="upper95" stroke="none" fill="#F59E0B" fillOpacity={0.1} name="95th Percentile" />
                        <Line type="monotone" dataKey="upper95" stroke="#F59E0B" strokeWidth={1} dot={false} strokeDasharray="3 3" />
                      </>
                    )}
                    {selectedQuantiles.includes("75%") && (
                      <Line type="monotone" dataKey="upper75" stroke="#8B5CF6" strokeWidth={1} dot={false} strokeDasharray="2 2" name="75th Percentile" />
                    )}
                    {selectedQuantiles.includes("25%") && (
                      <Line type="monotone" dataKey="lower25" stroke="#10B981" strokeWidth={1} dot={false} strokeDasharray="2 2" name="25th Percentile" />
                    )}
                    {selectedQuantiles.includes("5%") && (
                      <Line type="monotone" dataKey="lower5" stroke="#06B6D4" strokeWidth={1} dot={false} strokeDasharray="3 3" name="5th Percentile" />
                    )}
                    
                    {/* Historical actual data */}
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#9CA3AF" 
                      strokeWidth={2} 
                      dot={false} 
                      name="Historical Actual"
                    />
                    
                    {/* Median forecast */}
                    {selectedQuantiles.includes("50%") && (
                      <Area 
                        type="monotone" 
                        dataKey="forecast" 
                        stroke="#10B981" 
                        strokeWidth={2} 
                        fill="url(#colorForecast)"
                        dot={false} 
                        name="Median Forecast (50%)"
                      />
                    )}
                    
                    {/* Custom Quantile Prediction - PRIMARY LINE */}
                    <Area 
                      type="monotone" 
                      dataKey="customQuantile" 
                      stroke="#3B82F6" 
                      strokeWidth={3} 
                      fill="url(#colorCustom)"
                      dot={false} 
                      name={`Custom Quantile (${customQuantile}%)`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}