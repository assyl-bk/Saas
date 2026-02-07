import { useState } from "react";
import { GlassCard } from "./GlassCard";
import { TrendingUp, TrendingDown, Activity, Zap } from "lucide-react";
import { motion } from "motion/react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const tabs = ["Overview", "Patterns", "Trends", "Comparisons"];

// Mock data for business insights
const demandByHourData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  demand: 7000 + Math.sin(i / 4) * 1500 + Math.random() * 200,
}));

const demandByDayData = Array.from({ length: 7 }, (_, i) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  demand: 8000 + (i === 5 || i === 6 ? -500 : 0) + Math.random() * 300,
}));

const trendData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  actual: 8000 + i * 20 + Math.sin(i / 5) * 300,
  forecast: 8000 + i * 20 + Math.sin(i / 5) * 300 + (Math.random() - 0.5) * 100,
}));

const seasonalData = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  avgDemand: 7500 + Math.sin(i / 2) * 1000 + (i > 5 && i < 9 ? 500 : 0),
}));

const metricsData = [
  { name: "Peak Load", value: "9,234", unit: "MW", trend: "+8%", good: true },
  { name: "Off-Peak Load", value: "6,120", unit: "MW", trend: "-3%", good: true },
  { name: "Avg Daily Load", value: "8,145", unit: "MW", trend: "+5%", good: true },
  { name: "Load Factor", value: "88.2", unit: "%", trend: "+2%", good: true },
];

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Analytics & Insights</h2>
          <p className="text-sm text-foreground-secondary">
            Energy consumption patterns and demand trends
          </p>
        </div>
        <button className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10">
          Export Report
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-4">
        {metricsData.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-foreground-secondary mb-1">{metric.name}</p>
                  <p className="text-2xl font-bold font-mono text-white">{metric.value}</p>
                  {metric.unit && <p className="text-sm text-foreground-secondary">{metric.unit}</p>}
                </div>
                <div className={`p-2 rounded-lg ${metric.good ? "bg-success/20" : "bg-critical/20"}`}>
                  {metric.good ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-critical" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className={metric.good ? "text-success" : "text-critical"}>
                  {metric.trend}
                </span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === tab
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "bg-white/5 text-foreground-secondary hover:bg-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="text-lg font-bold text-white mb-4">Demand by Hour of Day</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandByHourData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                  <YAxis stroke="#9CA3AF" label={{ value: "Demand (MW)", angle: -90, position: "insideLeft", fill: "#9CA3AF" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="demand" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-bold text-white mb-4">Weekly Demand Pattern</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandByDayData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
                  <YAxis stroke="#9CA3AF" label={{ value: "Avg Demand (MW)", angle: -90, position: "insideLeft", fill: "#9CA3AF" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="demand" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === "Patterns" && (
        <GlassCard>
          <h3 className="text-lg font-bold text-white mb-4">Seasonal Demand Patterns</h3>
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={seasonalData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <defs>
                  <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" label={{ value: "Demand (MW)", angle: -90, position: "insideLeft", fill: "#9CA3AF" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(17, 24, 39, 0.95)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgDemand"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#demandGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-foreground-secondary mb-1">Summer Peak</p>
              <p className="text-xl font-bold text-white">+15%</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-foreground-secondary mb-1">Winter Peak</p>
              <p className="text-xl font-bold text-white">+8%</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-foreground-secondary mb-1">Spring/Fall</p>
              <p className="text-xl font-bold text-white">Baseline</p>
            </div>
          </div>
        </GlassCard>
      )}

      {activeTab === "Trends" && (
        <GlassCard>
          <h3 className="text-lg font-bold text-white mb-4">30-Day Demand Trend</h3>
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#9CA3AF" tick={{ fontSize: 10 }} interval={4} />
                <YAxis stroke="#9CA3AF" label={{ value: "Demand (MW)", angle: -90, position: "insideLeft", fill: "#9CA3AF" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(17, 24, 39, 0.95)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={false}
                  name="Actual Demand"
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Forecasted"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {activeTab === "Comparisons" && (
        <GlassCard>
          <h3 className="text-lg font-bold text-white mb-4">Period Comparisons</h3>
          <div className="h-[500px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-primary/30">
                <Activity className="w-10 h-10 text-primary" />
              </div>
              <p className="text-foreground-secondary">Comparison analysis coming soon</p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
