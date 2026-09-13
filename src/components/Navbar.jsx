import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  User, 
  Wrench, 
  ShieldCheck, 
  LayoutDashboard, 
  Bell, 
  Sun, 
  Moon, 
  AlertTriangle, 
  Check, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const { role, setRole, theme, setTheme, notifications, sosActive, triggerEmergencySOS } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const rolesList = [
    { id: 'resident', label: 'Resident Portal', icon: User, badge: 'Flat A-402' },
    { id: 'staff', label: 'Maintenance Tech', icon: Wrench, badge: 'Field Technician' },
    { id: 'guard', label: 'Security Guard Desk', icon: ShieldCheck, badge: 'Gate 1 Desk' },
    { id: 'admin', label: 'Admin Committee', icon: LayoutDashboard, badge: 'Executive' }
  ];

  const currentRoleObj = rolesList.find(r => r.id === role);

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel rounded-none border-x-0 border-t-0 px-4 lg:px-8 py-3 mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setRole('resident')}>
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 text-white shadow-lg glow-indigo">
            <Building2 className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight gradient-text">URBANPULSE</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> AI v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Smart Society & Facility Management Ecosystem</p>
          </div>
        </div>

        {/* Role Selector Tabs (Desktop) */}
        <div className="hidden md:flex items-center bg-slate-900/80 p-1.5 rounded-xl border border-slate-800/80 space-x-1">
          {rolesList.map((r) => {
            const Icon = r.icon;
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md glow-indigo'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">

          {/* Emergency SOS Button */}
          <button
            onClick={triggerEmergencySOS}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
              sosActive
                ? 'bg-rose-600 text-white animate-sos-pulse glow-rose'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
            }`}
            title="Trigger Emergency SOS Siren to Guards & Admin"
          >
            <AlertTriangle className="w-4 h-4 animate-bounce text-rose-400" />
            <span className="hidden sm:inline">EMERGENCY SOS</span>
          </button>

          {/* Mobile Role Dropdown */}
          <div className="relative md:hidden">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-indigo-400 border border-slate-700"
            >
              <span>{currentRoleObj?.label}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-50">
                {rolesList.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRole(r.id);
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-indigo-600/20 hover:text-indigo-400 flex items-center justify-between"
                  >
                    <span>{r.label}</span>
                    {role === r.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-400" /> Notifications
                  </h3>
                  <span className="text-xs text-indigo-400 font-semibold">{unreadCount} New</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto my-2 pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border text-xs ${
                        n.isSos
                          ? 'bg-rose-950/40 border-rose-800/50 text-rose-300'
                          : n.read
                          ? 'bg-slate-950/40 border-slate-800/40 text-slate-400'
                          : 'bg-indigo-950/30 border-indigo-500/30 text-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{n.text}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* User Profile Badge */}
          <div className="hidden lg:flex items-center space-x-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-xs font-bold">
              {role === 'resident' ? 'AS' : role === 'staff' ? 'RM' : role === 'guard' ? 'G1' : 'ADM'}
            </div>
            <div className="text-left text-xs">
              <p className="font-bold text-slate-200 line-clamp-1">{currentRoleObj?.label}</p>
              <p className="text-[10px] text-slate-400">{currentRoleObj?.badge}</p>
            </div>
          </div>

        </div>

      </div>
    </nav>
  );
};
