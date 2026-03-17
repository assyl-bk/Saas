import { GlassCard } from "./GlassCard";
import { TrendingUp, Zap, Target, CheckCircle, AlertTriangle, ArrowUp, Activity, Users, Database } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart, ReferenceLine } from "recharts";

// Generate realistic energy forecast data with dynamic quantile
const generateForecastData = (confidenceLevel: number) => {
  const data = [];
  const now = new Date();
  
  // Calculate uncertainty factor based on confidence level
  // Higher confidence levels have wider intervals
  const uncertaintyFactor = (confidenceLevel / 100) * 1.2; // Scale factor for interval width
  
  for (let i = 0; i < 48; i++) {
    const time = new Date(now.getTime() + i * 30 * 60000);
    const hour = time.getHours();
    
    // Realistic energy pattern
    let baseLoad = 7500;
    if (hour >= 6 && hour < 9) baseLoad += 1800;
    else if (hour >= 9 && hour < 17) baseLoad += 2200;
    else if (hour >= 17 && hour < 21) baseLoad += 2800;
    else if (hour >= 21 || hour < 6) baseLoad -= 800;
    
    baseLoad += (Math.sin(i / 8) * 600) + (Math.random() - 0.5) * 200;
    
    // Dynamic confidence intervals based on user selection
    const intervalWidth = 600 * uncertaintyFactor;
    
    data.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      actual: i < 24 ? baseLoad : null,
      forecast: baseLoad + (Math.random() - 0.5) * 100,
      lowerBound: baseLoad - intervalWidth,
      upperBound: baseLoad + intervalWidth,
      capacityThreshold: 11000,
    });
  }
  return data;
};

// KPI data - Energy Grid focused
const generateKPIData = () => ({
  currentLoad: 8542 + Math.floor(Math.random() * 100 - 50),
  peakForecast: 9234 + Math.floor(Math.random() * 50),
  dailyAvg: 8120 + Math.floor(Math.random() * 30),
  gridEfficiency: 94 + Math.floor(Math.random() * 3),
});

// Quick actions for energy grid operators and traders
const quickActions = [
  { 
    title: "Upload Time Series", 
    description: "Import historical demand data", 
    icon: Database, 
    color: "from-purple-500 to-pink-500" 
  },
  { 
    title: "Generate Forecast", 
    description: "Create quantile predictions", 
    icon: Zap, 
    color: "from-blue-500 to-cyan-500" 
  },
  { 
    title: "Export Reports", 
    description: "Download forecasts & analytics", 
    icon: TrendingUp, 
    color: "from-orange-500 to-red-500" 
  },
];

const CustomTooltip = ({ active, payload, theme }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={`backdrop-blur-xl rounded-lg p-3 shadow-xl ${
        theme === 'dark' 
          ? 'bg-[#111827]/95 border border-white/20' 
          : 'bg-white/95 border border-gray-300'
      }`}>
        <p className="text-xs text-foreground-secondary mb-2">{payload[0].payload.time}</p>
        {payload.map((entry: any, index: number) => (
          entry.value && (
            <p key={index} className="text-sm font-mono" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(0)} MW
            </p>
          )
        ))}
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const { theme } = useTheme();
  const [confidenceLevel, setConfidenceLevel] = useState(95); // User-selectable confidence level
  const [forecastData, setForecastData] = useState(generateForecastData(95));
  const [kpiData, setKPIData] = useState(generateKPIData());
  const [timePeriod, setTimePeriod] = useState("48H");

  // Update forecast when confidence level changes
  useEffect(() => {
    setForecastData(generateForecastData(confidenceLevel));
  }, [confidenceLevel]);

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setForecastData(generateForecastData(confidenceLevel));
      setKPIData(generateKPIData());
    }, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [confidenceLevel]);

  const kpiCards = [
    {
      label: "Current Load",
      value: kpiData.currentLoad.toLocaleString(),
      unit: "MW",
      trend: "+12%",
      trendUp: true,
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
      sparklineData: [8200, 8300, 8450, 8380, 8520, kpiData.currentLoad],
    },
    {
      label: "Peak Forecast (48h)",
      value: kpiData.peakForecast.toLocaleString(),
      unit: "MW",
      trend: "+8%",
      trendUp: true,
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
      sparklineData: [9100, 9150, 9200, 9180, 9210, kpiData.peakForecast],
    },
    {
      label: "Daily Average",
      value: kpiData.dailyAvg.toLocaleString(),
      unit: "MW",
      trend: "+5.3%",
      trendUp: true,
      icon: Target,
      color: "from-emerald-500 to-teal-500",
      sparklineData: [7900, 8000, 8050, 8100, 8150, kpiData.dailyAvg],
    },
    {
      label: "Grid Efficiency",
      value: kpiData.gridEfficiency.toString(),
      unit: "%",
      trend: "Optimal Range",
      trendUp: true,
      icon: Activity,
      color: "from-green-500 to-emerald-500",
      sparklineData: [93, 94, 93, 95, 94, kpiData.gridEfficiency],
    },
  ];
  return (
    <div className="space-y-8">
      {/* Hero Forecast Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h2 className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Real-Time Energy Demand Forecast</h2>
              <p className={`text-sm mb-3 ${
                theme === 'dark' ? 'text-foreground-secondary' : 'text-gray-600'
              }`}>
                Probabilistic load forecasting with {confidenceLevel}% confidence intervals
              </p>
              
              {/* Confidence Level Selector */}
              <div className="flex items-center gap-4">
                <label className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Confidence Level:</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="50"
                    max="99"
                    step="5"
                    value={confidenceLevel}
                    onChange={(e) => setConfidenceLevel(Number(e.target.value))}
                    className="w-48 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(confidenceLevel - 50) / 49 * 100}%, rgba(255,255,255,0.1) ${(confidenceLevel - 50) / 49 * 100}%, rgba(255,255,255,0.1) 100%)`
                    }}
                  />
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/20 border border-primary/30 min-w-[70px] justify-center">
                    <span className="text-lg font-bold text-primary">{confidenceLevel}%</span>
                  </div>
                </div>
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'
                }`}>
                  {confidenceLevel <= 70 ? "Narrow interval (lower certainty)" : 
                   confidenceLevel <= 85 ? "Moderate interval" : 
                   "Wide interval (higher certainty)"}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {["24H", "48H", "7D", "30D"].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timePeriod === period
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-white/5 text-foreground-secondary hover:bg-white/10"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
                />
                <XAxis 
                  dataKey="time" 
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#4B5563', fontSize: 12 }}
                  tickLine={false}
                  interval={5}
                />
                <YAxis 
                  stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                  tick={{ fill: theme === 'dark' ? '#9CA3AF' : '#4B5563', fontSize: 12 }}
                  tickLine={false}
                  label={{ value: "Demand (MW)", angle: -90, position: "insideLeft", fill: theme === 'dark' ? '#9CA3AF' : '#4B5563' }}
                  domain={[6000, 12000]}
                />
                <Tooltip content={<CustomTooltip theme={theme} />} />
                
                {/* Capacity Threshold Line */}
                <ReferenceLine 
                  y={11000} 
                  stroke="#EF4444" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                  label={{ value: "Capacity Limit", fill: "#EF4444", fontSize: 11 }}
                />
                
                {/* Dynamic Confidence bands based on user selection */}
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  stroke="none"
                  fill="rgba(59, 130, 246, 0.1)"
                  strokeWidth={0}
                />
                <Area
                  type="monotone"
                  dataKey="lowerBound"
                  stroke="none"
                  fill="rgba(59, 130, 246, 0.1)"
                  strokeWidth={0}
                />
                
                {/* Forecast line */}
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#colorForecast)"
                  name="Forecast"
                />
                
                {/* Actual line */}
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#10B981"
                  strokeWidth={3}
                  fill="url(#colorActual)"
                  name="Actual"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className={`flex items-center gap-6 mt-4 pt-4 ${
            theme === 'dark' ? 'border-t border-white/10' : 'border-t border-gray-200'
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10B981]" />
              <span className="text-sm text-foreground-secondary">Actual Load</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
              <span className="text-sm text-foreground-secondary">Forecast</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-3 bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent rounded" />
              <span className="text-sm text-foreground-secondary">{confidenceLevel}% Confidence</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <div className="w-3 h-0.5 bg-[#EF4444]" />
              <span className="text-sm text-foreground-secondary">Capacity Threshold</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-semibold">Live Updates</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard className="relative overflow-hidden">
                {/* Background sparkline */}
                <div className="absolute inset-0 opacity-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={card.sparklineData.map((val, i) => ({ value: val, index: i }))}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={theme === 'dark' ? '#FFFFFF' : '#3B82F6'} 
                        strokeWidth={2} 
                        dot={false} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {card.trendUp && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-success/10 border border-success/20">
                        <ArrowUp className="w-3 h-3 text-success" />
                        <span className="text-xs font-semibold text-success">{card.trend}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-foreground-secondary">{card.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-foreground font-['JetBrains_Mono']">
                        {card.value}
                      </span>
                      {card.unit && (
                        <span className="text-lg text-foreground-secondary">{card.unit}</span>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Alert Panel - Capacity Threshold Alert */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <GlassCard className="border-l-4 border-warning bg-warning/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">Grid Capacity Alert</h3>
              <p className="text-sm text-foreground-secondary">
                Forecasted demand between 18:00-20:00 may exceed grid capacity threshold (11,000 MW) by approximately 234 MW. 
                Consider initiating load balancing protocols or demand response programs.
              </p>
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <span>Alert generated at {new Date().toLocaleTimeString()}</span>
                <span>•</span>
                <span>Confidence: 87%</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-warning/20 hover:bg-warning/30 text-warning text-sm font-medium transition-colors">
                View Details
              </button>
              <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-foreground-secondary text-sm font-medium transition-colors">
                Acknowledge
              </button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h3 className={`text-xl font-bold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Quick Actions for Grid Operators</h3>
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <GlassCard hover className="text-center cursor-pointer">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className={`font-semibold mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{action.title}</h4>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-foreground-secondary' : 'text-gray-600'
                  }`}>{action.description}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}