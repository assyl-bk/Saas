import { GlassCard } from "./GlassCard";
import { TrendingUp, Zap, Target, CheckCircle, AlertTriangle, ArrowUp } from "lucide-react";
import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart } from "recharts";

// Generate mock forecast data
const generateForecastData = () => {
  const data = [];
  const now = new Date();
  for (let i = 0; i < 48; i++) {
    const time = new Date(now.getTime() + i * 30 * 60000);
    const baseLoad = 8000 + Math.sin(i / 8) * 1500 + Math.random() * 200;
    data.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      actual: i < 24 ? baseLoad : null,
      forecast: baseLoad + (Math.random() - 0.5) * 100,
      lower95: baseLoad - 400,
      upper95: baseLoad + 400,
      lower50: baseLoad - 150,
      upper50: baseLoad + 150,
    });
  }
  return data;
};

const forecastData = generateForecastData();

// KPI data
const kpiCards = [
  {
    label: "Current Load",
    value: "8,542",
    unit: "MW",
    trend: "+12%",
    trendUp: true,
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    sparklineData: [8200, 8300, 8450, 8380, 8520, 8542],
  },
  {
    label: "Peak Forecast",
    value: "9,234",
    unit: "MW",
    trend: "+8%",
    trendUp: true,
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
    sparklineData: [9100, 9150, 9200, 9180, 9210, 9234],
  },
  {
    label: "Daily Average",
    value: "8,120",
    unit: "MW",
    trend: "+5.3%",
    trendUp: true,
    icon: Target,
    color: "from-emerald-500 to-teal-500",
    sparklineData: [7900, 8000, 8050, 8100, 8150, 8120],
  },
  {
    label: "System Status",
    value: "Optimal",
    unit: "",
    trend: "All systems operational",
    trendUp: true,
    icon: CheckCircle,
    color: "from-green-500 to-emerald-500",
    sparklineData: [100, 100, 99, 100, 100, 100],
  },
];

// Quick actions
const quickActions = [
  { title: "Upload Data", description: "Import historical datasets", icon: "📊", color: "from-purple-500 to-pink-500" },
  { title: "View Reports", description: "Access detailed insights", icon: "📈", color: "from-teal-500 to-green-500" },
  { title: "Export Data", description: "Download forecasts & reports", icon: "📥", color: "from-orange-500 to-red-500" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-blur-xl bg-[#111827]/95 border border-white/20 rounded-lg p-3 shadow-xl">
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
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Real-Time Energy Forecast</h2>
              <p className="text-sm text-foreground-secondary">
                Predictive load modeling with confidence intervals
              </p>
            </div>
            <div className="flex gap-2">
              {["24H", "48H", "7D", "30D"].map((period, index) => (
                <button
                  key={period}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    index === 1
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
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF" 
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  tickLine={false}
                  interval={5}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  tickLine={false}
                  label={{ value: "Load (MW)", angle: -90, position: "insideLeft", fill: "#9CA3AF" }}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Confidence bands */}
                <Area
                  type="monotone"
                  dataKey="upper95"
                  stroke="none"
                  fill="rgba(59, 130, 246, 0.1)"
                  strokeWidth={0}
                />
                <Area
                  type="monotone"
                  dataKey="lower95"
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

          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
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
              <span className="text-sm text-foreground-secondary">95% Confidence</span>
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
                      <Line type="monotone" dataKey="value" stroke="white" strokeWidth={2} dot={false} />
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
                      <span className="text-4xl font-bold text-white font-['JetBrains_Mono']">
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

      {/* Alert Panel */}
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
              <h3 className="font-semibold text-white mb-1">Peak Demand Alert</h3>
              <p className="text-sm text-foreground-secondary">
                Forecasted demand between 18:00-20:00 exceeds threshold by 234 MW. Consider load balancing strategies.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-warning/20 hover:bg-warning/30 text-warning text-sm font-medium transition-colors">
                View Details
              </button>
              <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-foreground-secondary text-sm font-medium transition-colors">
                Dismiss
              </button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <GlassCard hover className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-3xl shadow-lg`}>
                  {typeof action.icon === "string" ? action.icon : <action.icon className="w-8 h-8 text-white" />}
                </div>
                <h4 className="font-semibold text-white mb-1">{action.title}</h4>
                <p className="text-sm text-foreground-secondary">{action.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}