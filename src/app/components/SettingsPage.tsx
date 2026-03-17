import { useState } from "react";
import { GlassCard } from "./GlassCard";
import { User, Users, CreditCard, Key, Settings as SettingsIcon, Activity, Shield, Mail, Bell } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";

const settingsTabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "team", label: "Team", icon: Users },
  { id: "api", label: "API Keys", icon: Key },
];

const teamMembers = [
  { name: "John Doe", email: "john@company.com", role: "Admin", status: "active", avatar: "JD" },
  { name: "Sarah Smith", email: "sarah@company.com", role: "Editor", status: "active", avatar: "SS" },
  { name: "Mike Johnson", email: "mike@company.com", role: "Viewer", status: "active", avatar: "MJ" },
  { name: "Emily Brown", email: "emily@company.com", role: "Editor", status: "invited", avatar: "EB" },
];

const apiKeys = [
  { name: "Production API", key: "fip_live_••••••••••••3xK2", created: "Jan 15, 2026", lastUsed: "2 hours ago" },
  { name: "Development API", key: "fip_test_••••••••••••7mN9", created: "Dec 10, 2025", lastUsed: "5 days ago" },
];

export function SettingsPage() {
  const { user, rolesMatrix } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const roleLabels: Record<string, string> = {
    energy_grid_operator: "Energy Grid Operator",
    energy_trader: "Energy Trader",
    energy_planner: "Energy Planner",
    system_administrator: "System Administrator",
  };

  return (
    <div className="grid grid-cols-[250px_1fr] gap-6">
      {/* Settings Sidebar */}
      <div className="space-y-2">
        {settingsTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-white/5 text-foreground-secondary hover:bg-white/10 border border-transparent"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {activeTab === "profile" && (
          <>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Profile Settings</h2>
              <p className="text-sm text-foreground-secondary">
                Manage your personal information and preferences
              </p>
            </div>

            <GlassCard>
              <div className="flex items-start gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                    JD
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white hover:bg-primary/80 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-1">John Doe</h3>
                  <p className="text-sm text-foreground-secondary mb-4">System Administrator</p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/30 text-sm font-medium hover:bg-primary/30 transition-colors">
                      Change Photo
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-white/5 text-foreground-secondary border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground-secondary mb-2 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground-secondary mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="john@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground-secondary mb-2 block">
                    Job Title
                  </label>
                  <input
                    type="text"
                    defaultValue="Energy Systems Analyst"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground-secondary mb-2 block">
                    Department
                  </label>
                  <input
                    type="text"
                    defaultValue="Operations"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
                <button className="px-6 py-3 rounded-lg bg-white/5 text-foreground-secondary border border-white/10 font-medium hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-[#2563EB] text-white font-medium hover:shadow-lg hover:shadow-primary/30 transition-all">
                  Save Changes
                </button>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Actor Roles & Functional Needs</h3>
                {user?.role && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
                    Current Role: {roleLabels[user.role] ?? user.role}
                  </span>
                )}
              </div>
              <div className="space-y-4">
                {rolesMatrix?.roles &&
                  Object.entries(rolesMatrix.roles).map(([role, needs]) => (
                    <div key={role} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <h4 className="font-semibold text-foreground mb-2">{roleLabels[role] ?? role}</h4>
                      <ul className="space-y-1">
                        {needs.map((need) => (
                          <li key={need} className="text-sm text-foreground-secondary">• {need}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-bold text-foreground mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: "Email Notifications", desc: "Receive forecast alerts via email" },
                  { label: "Peak Demand Alerts", desc: "Get notified when demand exceeds threshold" },
                  { label: "Model Performance Reports", desc: "Weekly model accuracy summaries" },
                  { label: "System Updates", desc: "Platform updates and maintenance notices" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-foreground-secondary">{item.desc}</p>
                    </div>
                    <label className="relative inline-block w-12 h-6">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                      <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:bg-primary transition-all cursor-pointer" />
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6" />
                    </label>
                  </div>
                ))}
              </div>
            </GlassCard>
          </>
        )}

        {activeTab === "team" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Team Management</h2>
                <p className="text-sm text-foreground-secondary">
                  Manage team members and their permissions
                </p>
              </div>
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-[#2563EB] text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all">
                Invite Member
              </button>
            </div>

            <GlassCard className="overflow-hidden p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground-secondary uppercase">
                      User
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground-secondary uppercase">
                      Role
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-foreground-secondary uppercase">
                      Status
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-foreground-secondary uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member, index) => (
                    <motion.tr
                      key={member.email}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{member.name}</p>
                            <p className="text-xs text-foreground-secondary">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white">
                          <option>{member.role}</option>
                          <option>Admin</option>
                          <option>Editor</option>
                          <option>Viewer</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            member.status === "active"
                              ? "bg-success/20 text-success border border-success/30"
                              : "bg-warning/20 text-warning border border-warning/30"
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-sm text-foreground-secondary hover:text-critical transition-colors">
                          Remove
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          </>
        )}

        {activeTab === "api" && (
          <>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">API Keys</h2>
              <p className="text-sm text-foreground-secondary">
                Manage API keys for programmatic access
              </p>
            </div>

            <GlassCard className="bg-gradient-to-br from-warning/5 to-critical/5 border-warning/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Keep your API keys secure</h3>
                  <p className="text-sm text-foreground-secondary">
                    Never share your API keys in public repositories or client-side code. Store them securely using environment variables.
                  </p>
                </div>
              </div>
            </GlassCard>

            <div className="space-y-4">
              {apiKeys.map((key, index) => (
                <motion.div
                  key={key.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{key.name}</h3>
                        <p className="text-sm font-mono text-foreground-secondary">{key.key}</p>
                      </div>
                      <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-foreground-secondary text-sm font-medium transition-colors">
                        Reveal
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-foreground-secondary pt-4 border-t border-white/10">
                      <div className="flex gap-4">
                        <span>Created: {key.created}</span>
                        <span>Last used: {key.lastUsed}</span>
                      </div>
                      <button className="text-critical hover:text-critical/80 font-medium">
                        Revoke
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <button className="w-full py-4 rounded-xl border-2 border-dashed border-white/20 hover:border-primary/50 hover:bg-primary/5 text-foreground-secondary hover:text-primary font-medium transition-all">
              + Create New API Key
            </button>
          </>
        )}
    
      </div>
    </div>
  );
}
