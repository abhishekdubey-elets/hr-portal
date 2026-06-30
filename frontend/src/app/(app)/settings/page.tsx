"use client";
import { useState } from "react";
import { User, Bell, Shield, Palette, Building, CreditCard, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "company", label: "Company", icon: Building },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "billing", label: "Billing", icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-0.5">Manage your account and workspace preferences</p>
      </div>

      <div className="flex gap-6">
        <aside className="w-52 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  activeTab === tab.id ? "bg-purple-500/15 text-purple-400" : "text-gray-400 hover:text-white hover:bg-[#1E1E24]"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 bg-[#16161A] border border-[#1E1E24] rounded-2xl p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Profile Information</h2>
                <p className="text-sm text-gray-400">Update your personal details</p>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">SA</div>
                <div>
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG · Max 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Full Name" defaultValue="Sarah Admin" />
                <Input label="Email Address" defaultValue="sarah@company.com" type="email" />
                <Input label="Job Title" defaultValue="HR Director" />
                <Input label="Department" defaultValue="Human Resources" />
                <Input label="Phone" defaultValue="+1 (555) 234-5678" />
                <Input label="Location" defaultValue="San Francisco, CA" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Bio</label>
                <textarea rows={3} defaultValue="HR Director at TechCorp with 10+ years experience building people-first cultures." className="w-full px-4 py-3 bg-[#111114] border border-[#1E1E24] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 resize-none" />
              </div>
              <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>{saved ? "Saved!" : "Save Changes"}</Button>
            </div>
          )}

          {activeTab === "company" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Company Settings</h2>
                <p className="text-sm text-gray-400">Manage your organization details</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Company Name" defaultValue="TechCorp Inc." />
                <Input label="Industry" defaultValue="Software & Technology" />
                <Input label="Company Size" defaultValue="501-1,000 employees" />
                <Input label="Founded" defaultValue="2015" />
                <Input label="Website" defaultValue="https://techcorp.com" />
                <Input label="HQ Location" defaultValue="San Francisco, CA" />
              </div>
              <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>{saved ? "Saved!" : "Save Changes"}</Button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Notification Preferences</h2>
                <p className="text-sm text-gray-400">Choose what you want to be notified about</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: "New candidate applications", desc: "Get notified when candidates apply to open positions", enabled: true },
                  { label: "AI screening completed", desc: "Alert when resume screening finishes", enabled: true },
                  { label: "Interview reminders", desc: "30-minute reminder before scheduled interviews", enabled: true },
                  { label: "Offer status changes", desc: "When candidates accept or decline offers", enabled: true },
                  { label: "Employee attrition risk", desc: "AI flags high-risk employees", enabled: false },
                  { label: "Weekly HR digest", desc: "Summary of the week's HR activity", enabled: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 bg-[#111114] rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-[#1E1E24] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Security</h2>
                <p className="text-sm text-gray-400">Keep your account safe</p>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-[#111114] rounded-xl">
                  <h3 className="text-sm font-semibold text-white mb-3">Change Password</h3>
                  <div className="space-y-3">
                    <Input label="Current Password" type="password" placeholder="••••••••" />
                    <Input label="New Password" type="password" placeholder="Min. 8 characters" />
                    <Input label="Confirm New Password" type="password" placeholder="Repeat password" />
                  </div>
                  <Button className="mt-4" size="sm">Update Password</Button>
                </div>
                <div className="p-4 bg-[#111114] rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-400 mt-0.5">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="warning">Not enabled</Badge>
                    <Button size="sm" variant="outline">Enable 2FA</Button>
                  </div>
                </div>
                <div className="p-4 bg-[#111114] rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-white">Active Sessions</p>
                    <Button size="sm" variant="ghost">Sign out all</Button>
                  </div>
                  {[
                    { device: "MacBook Pro — Chrome", location: "San Francisco, CA", time: "Now · Current session" },
                    { device: "iPhone 15 — Safari", location: "San Francisco, CA", time: "2 hours ago" },
                  ].map((s) => (
                    <div key={s.device} className="flex items-center justify-between py-2 border-t border-[#1E1E24] first:border-t-0">
                      <div>
                        <p className="text-xs font-medium text-white">{s.device}</p>
                        <p className="text-xs text-gray-500">{s.location} · {s.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Appearance</h2>
                <p className="text-sm text-gray-400">Customize your PeopleAI experience</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300 mb-3">Theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Dark", colors: "bg-[#0A0A0B] border-purple-500", active: true },
                    { label: "Light", colors: "bg-white border-[#1E1E24]", active: false },
                    { label: "System", colors: "bg-gradient-to-br from-[#0A0A0B] to-white border-[#1E1E24]", active: false },
                  ].map((t) => (
                    <div key={t.label} className={cn("p-4 rounded-xl border-2 cursor-pointer text-center", t.active ? "border-purple-500" : "border-[#1E1E24] hover:border-purple-500/50")}>
                      <div className={cn("w-full h-12 rounded-lg mb-2", t.colors)} />
                      <p className="text-xs font-medium text-white">{t.label}</p>
                      {t.active && <Badge variant="purple" className="mt-1">Active</Badge>}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300 mb-3">Accent Color</p>
                <div className="flex gap-3">
                  {[
                    { color: "bg-purple-500", active: true },
                    { color: "bg-blue-500", active: false },
                    { color: "bg-green-500", active: false },
                    { color: "bg-orange-500", active: false },
                    { color: "bg-pink-500", active: false },
                  ].map((c, i) => (
                    <button key={i} className={cn("w-9 h-9 rounded-full transition-all", c.color, c.active ? "ring-2 ring-white ring-offset-2 ring-offset-[#16161A]" : "opacity-60 hover:opacity-100")} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Billing</h2>
                <p className="text-sm text-gray-400">Manage your subscription and billing</p>
              </div>
              <div className="p-5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">Professional Plan</p>
                    <p className="text-gray-400 text-sm mt-0.5">Up to 500 employees · All AI features · Priority support</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">$299<span className="text-sm font-normal text-gray-400">/mo</span></p>
                    <Badge variant="success">Active</Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Next billing date", value: "July 1, 2024" },
                  { label: "Seats used", value: "247 / 500" },
                  { label: "AI credits", value: "8,240 / 10,000" },
                ].map((m) => (
                  <div key={m.label} className="bg-[#111114] rounded-xl p-4">
                    <p className="text-xs text-gray-400">{m.label}</p>
                    <p className="text-sm font-semibold text-white mt-1">{m.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Upgrade Plan</Button>
                <Button variant="ghost">View Invoices</Button>
                <Button variant="danger">Cancel Subscription</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
