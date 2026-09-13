import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateAINotice } from '../services/aiEngine';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Send, 
  Users, 
  ShieldCheck, 
  Globe, 
  BarChart3,
  Flame,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminDashboard = () => {
  const { complaints, notices, addNotice, updateTicketStatus } = useApp();

  // AI Notice Studio state
  const [noticePrompt, setNoticePrompt] = useState('');
  const [generatedNotice, setGeneratedNotice] = useState(null);
  const [noticeCategory, setNoticeCategory] = useState('Urgent Maintenance');

  // Stats calculation
  const totalTickets = complaints.length;
  const resolvedTickets = complaints.filter(c => c.status === 'Resolved').length;
  const pendingTickets = complaints.filter(c => c.status === 'Pending').length;
  const criticalTickets = complaints.filter(c => c.priority === 'Critical').length;
  const resolutionRate = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 100;

  const departmentCounts = {
    Plumbing: complaints.filter(c => c.category === 'Plumbing').length,
    Electrical: complaints.filter(c => c.category === 'Electrical').length,
    Elevator: complaints.filter(c => c.category === 'Elevator').length,
    Civil: complaints.filter(c => c.category === 'Civil').length,
  };

  const handleGenerateNotice = () => {
    if (!noticePrompt.trim()) return;
    const res = generateAINotice(noticePrompt);
    setGeneratedNotice(res);
  };

  const handleBroadcastNotice = () => {
    if (!generatedNotice) return;
    addNotice({
      title: generatedNotice.title,
      content: generatedNotice.content,
      category: noticeCategory,
      translations: generatedNotice.translations
    });

    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    setNoticePrompt('');
    setGeneratedNotice(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Executive Command Banner */}
      <div className="glass-panel p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950/50 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Management Committee Command Dashboard</h2>
            <p className="text-xs text-slate-400">Society Executive Overview • Department SLA Performance & AI Broadcast Center</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 98.2% SLA Compliance
          </span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 space-y-2 border-slate-800">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Total Maintenance Tickets</span>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{totalTickets}</p>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% from last month
          </p>
        </div>

        <div className="glass-card p-4 space-y-2 border-slate-800">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Resolution Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">{resolutionRate}%</p>
          <p className="text-[10px] text-slate-400">{resolvedTickets} of {totalTickets} Tickets Closed</p>
        </div>

        <div className="glass-card p-4 space-y-2 border-slate-800">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Avg SLA Resolution Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-cyan-400 font-mono">4.2 hrs</p>
          <p className="text-[10px] text-cyan-300 font-medium">Guaranteed &lt; 12h SLA target</p>
        </div>

        <div className="glass-card p-4 space-y-2 border-slate-800">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Vision AI Verified Ratio</span>
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-2xl font-black text-violet-400 font-mono">96.4%</p>
          <p className="text-[10px] text-violet-300">0 Fraudulent Closures</p>
        </div>
      </div>

      {/* Main Grid: Department Heatmap + AI Notice Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department SLA Heatmap & Workload */}
        <div className="lg:col-span-1 glass-panel p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" /> Department Breakdown & Workload
          </h3>

          <div className="space-y-3 pt-2">
            {Object.entries(departmentCounts).map(([dept, count]) => (
              <div key={dept} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300 font-semibold">
                  <span>{dept}</span>
                  <span className="font-mono">{count} tickets</span>
                </div>
                <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all"
                    style={{ width: `${Math.min((count / totalTickets) * 100 + 15, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300">Staff Allocation</h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-200">Ramesh (Elevator/Plumbing)</p>
                  <p className="text-[10px] text-slate-400">Active Workload: 2 Tickets</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Optimal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-200">Suresh (Electrical Lead)</p>
                  <p className="text-[10px] text-slate-400">Active Workload: 1 Ticket</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Multilingual Notice Drafting Studio */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-spin-slow" />
            <div>
              <h3 className="text-sm font-bold text-white">AI Notice Generator & Multilingual Broadcast Studio</h3>
              <p className="text-[11px] text-slate-400">Type a brief topic prompt. AI generates formal notices with auto-translation to Hindi & Marathi.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Enter Announcement Topic / Prompt</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Water tank cleaning tomorrow 10am to 2pm"
                  value={noticePrompt}
                  onChange={(e) => setNoticePrompt(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleGenerateNotice}
                  className="gradient-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Generate AI Draft
                </button>
              </div>
            </div>

            {/* AI Generated Draft Output */}
            {generatedNotice && (
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-3 animate-in fade-in duration-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-indigo-400">AI Generated Notice Preview</span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    English + Hindi + Marathi Translated
                  </span>
                </div>

                <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                  <p className="font-bold text-white">{generatedNotice.title}</p>
                  <p className="text-slate-300 whitespace-pre-line leading-relaxed">{generatedNotice.content}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  >
                    <option value="Urgent Maintenance">Urgent Maintenance</option>
                    <option value="General Meeting">General Meeting</option>
                    <option value="Event Notice">Event Notice</option>
                  </select>

                  <button
                    onClick={handleBroadcastNotice}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 hover:opacity-90"
                  >
                    <Send className="w-3.5 h-3.5" /> Broadcast to All Residents
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
