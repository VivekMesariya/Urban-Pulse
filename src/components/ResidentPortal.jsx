import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { analyzeComplaintNLP, checkDuplicateComplaints } from '../services/aiEngine';
import { VisionAIVerifier } from './VisionAIVerifier';
import { 
  PlusCircle, 
  Clock, 
  QrCode, 
  FileText, 
  CreditCard, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  ChevronRight, 
  Image as ImageIcon,
  Share2,
  Globe,
  Tag,
  ShieldCheck,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ResidentPortal = () => {
  const { complaints, addComplaint, visitors, createGatePass, notices, dues, payDues } = useApp();
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' | 'new_ticket' | 'gate_pass' | 'notices' | 'dues'

  // New Ticket Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [aiPreview, setAiPreview] = useState(null);
  const [duplicates, setDuplicates] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Gate pass state
  const [visitorName, setVisitorName] = useState('');
  const [visitorType, setVisitorType] = useState('Delivery (Amazon/Flipkart)');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [generatedPass, setGeneratedPass] = useState(null);

  // Notice language
  const [noticeLang, setNoticeLang] = useState('en');

  // Handle Live Title/Desc Change to run AI
  const handleInputChange = (t, d) => {
    setTitle(t);
    setDescription(d);

    if (t.length > 5 || d.length > 10) {
      const nlp = analyzeComplaintNLP(t, d);
      setAiPreview(nlp);
      const dupes = checkDuplicateComplaints(t, d, complaints);
      setDuplicates(dupes);
    } else {
      setAiPreview(null);
      setDuplicates([]);
    }
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const created = addComplaint({
      title,
      description,
      image,
      residentName: 'Aarav Sharma',
      flatNumber: 'A-402'
    });

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });

    // Reset Form
    setTitle('');
    setDescription('');
    setImage('');
    setAiPreview(null);
    setDuplicates([]);
    setSelectedTicket(created);
    setActiveTab('tickets');
  };

  const handleGeneratePass = (e) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    const pass = createGatePass({
      visitorName,
      visitorType,
      vehicleNumber,
      flatNumber: 'A-402',
      hostName: 'Aarav Sharma'
    });

    setGeneratedPass(pass);
    setVisitorName('');
    setVehicleNumber('');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Banner */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Resident Dashboard • Tower A-402</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome back, Aarav! 👋</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Report issues with instant AI triage, track maintenance timelines, generate digital visitor passes, and view society notices.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('new_ticket')}
            className="gradient-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg hover:scale-105 transition-transform"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Lodge AI Complaint</span>
          </button>
        </div>

        {/* Tab Navigation Pill */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto pb-1">
          {[
            { id: 'tickets', label: 'My Tickets', count: complaints.filter(c => c.flatNumber === 'A-402' || true).length, icon: FileText },
            { id: 'gate_pass', label: 'Visitor Gate-Pass', count: visitors.length, icon: QrCode },
            { id: 'notices', label: 'Notice Board', count: notices.length, icon: Globe },
            { id: 'dues', label: 'Society Dues', count: dues.filter(d => d.status === 'Pending').length, icon: CreditCard }
          ].map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active 
                    ? 'bg-indigo-600 text-white shadow-md glow-indigo'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                {t.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: My Tickets / Ticket Details */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-sm font-bold text-slate-300 flex items-center justify-between">
              <span>Active Maintenance Tickets</span>
              <span className="text-xs text-indigo-400">{complaints.length} Total</span>
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {complaints.map(t => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`glass-card p-4 cursor-pointer transition-all border ${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-950/40 glow-indigo' 
                        : 'border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[11px] text-indigo-400 font-bold">{t.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.priority === 'Critical' ? 'badge-critical' :
                        t.priority === 'High' ? 'badge-high' :
                        t.priority === 'Medium' ? 'badge-medium' : 'badge-low'
                      }`}>
                        {t.priority} Urgency
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 mt-2 line-clamp-1">{t.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{t.description}</p>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/60 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-cyan-400" /> {t.category}
                      </span>
                      <span className={`font-semibold ${
                        t.status === 'Resolved' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ticket Inspector View */}
          <div className="lg:col-span-2 space-y-4">
            {selectedTicket ? (
              <div className="glass-panel p-6 space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-extrabold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/30">
                        {selectedTicket.id}
                      </span>
                      <span className="text-xs text-slate-400">• {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">{selectedTicket.title}</h3>
                  </div>

                  <span className={`self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full ${
                    selectedTicket.status === 'Resolved' ? 'badge-verified' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    Status: {selectedTicket.status}
                  </span>
                </div>

                {/* 4-Step Resolution Timeline */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visual SLA Progress Timeline</h4>
                  <div className="grid grid-cols-4 gap-2 text-center pt-2">
                    {[
                      { step: 1, label: 'Reported & NLP AI Triage', done: true },
                      { step: 2, label: 'Technician Assigned', done: selectedTicket.status !== 'Pending' },
                      { step: 3, label: 'In Repair Progress', done: selectedTicket.status === 'In Progress' || selectedTicket.status === 'Resolved' },
                      { step: 4, label: 'Vision AI Verified', done: selectedTicket.status === 'Resolved' }
                    ].map(st => (
                      <div key={st.step} className="space-y-1">
                        <div className={`h-2 rounded-full transition-all ${
                          st.done ? 'bg-gradient-to-r from-indigo-500 to-emerald-400 shadow-sm' : 'bg-slate-800'
                        }`}></div>
                        <p className={`text-[10px] font-semibold ${st.done ? 'text-slate-200' : 'text-slate-500'}`}>
                          {st.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Assigned Specialist:</span>
                    <p className="font-bold text-slate-200 mt-0.5">{selectedTicket.assignedStaff}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Estimated SLA Window:</span>
                    <p className="font-bold text-cyan-400 mt-0.5">{selectedTicket.slaHours} Hours Guaranteed</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-slate-400 font-medium">Description:</span>
                    <p className="text-slate-300 mt-1 leading-relaxed">{selectedTicket.description}</p>
                  </div>
                </div>

                {/* Vision AI Proof Inspector */}
                <VisionAIVerifier ticket={selectedTicket} />

              </div>
            ) : (
              <div className="glass-panel p-12 text-center text-slate-500 space-y-3">
                <FileText className="w-12 h-12 mx-auto stroke-1 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-300">Select a Ticket to Inspect Details</h3>
                <p className="text-xs max-w-sm mx-auto">
                  Click any ticket on the left menu to view live SLA timelines, AI confidence tags, and technician proof photos.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Lodge AI Ticket Form */}
      {activeTab === 'new_ticket' && (
        <div className="max-w-2xl mx-auto glass-panel p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Lodge Maintenance Ticket (Smart AI Triage)</h3>
              <p className="text-xs text-slate-400">Describe the issue below. AI will automatically classify, rate urgency & detect duplicates.</p>
            </div>
          </div>

          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Issue Title / Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Water leak under bathroom sink or Elevator door noisy"
                value={title}
                onChange={(e) => handleInputChange(e.target.value, description)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Detailed Description</label>
              <textarea
                rows={3}
                required
                placeholder="Provide location details (e.g. Tower A 4th Floor) and symptoms..."
                value={description}
                onChange={(e) => handleInputChange(title, e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Photo Proof URL (Optional)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* AI Real-time Triage Feedback Box */}
            {aiPreview && (
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Classification Engine Output
                  </span>
                  <span className="font-mono text-[10px] text-cyan-400 font-semibold">
                    Confidence: {aiPreview.confidenceScore}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400">Category Tag:</span>
                    <p className="font-bold text-slate-200">{aiPreview.category}</p>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400">Predicted Urgency & SLA:</span>
                    <p className="font-bold text-amber-400">{aiPreview.priority} ({aiPreview.slaHours}h SLA)</p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Duplicate Detection Warning */}
            {duplicates.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>AI Alert: Potential Duplicate Complaint Detected!</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Another resident has reported a similar issue. You can upvote or track the existing ticket instead of creating a duplicate.
                </p>
                {duplicates.map((d, idx) => (
                  <div key={idx} className="bg-slate-900 p-2 rounded border border-slate-800 text-[11px] flex justify-between items-center">
                    <div>
                      <span className="font-mono font-bold text-amber-300">{d.id}: </span>
                      <span className="text-slate-200">{d.title}</span>
                    </div>
                    <span className="text-[10px] text-indigo-400 font-bold">{d.similarity}% Match</span>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              className="w-full gradient-btn-primary py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Submit Maintenance Request</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Visitor Gate Pass Generator */}
      {activeTab === 'gate_pass' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pass Generator Form */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Pre-Approve Visitor / Delivery</h3>
                <p className="text-[11px] text-slate-400">Generates instant digital QR gate pass for security entry</p>
              </div>
            </div>

            <form onSubmit={handleGeneratePass} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Visitor Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Visitor Purpose</label>
                <select
                  value={visitorType}
                  onChange={(e) => setVisitorType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Delivery (Amazon/Flipkart)">Delivery (Amazon/Flipkart)</option>
                  <option value="Food Delivery (Swiggy/Zomato)">Food Delivery (Swiggy/Zomato)</option>
                  <option value="Personal Guest / Family">Personal Guest / Family</option>
                  <option value="Home Service (Urban Company)">Home Service (Urban Company)</option>
                  <option value="Cab Driver (Uber/Ola)">Cab Driver (Uber/Ola)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle No. (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. MH 12 AB 4589"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs font-bold hover:opacity-90 shadow-md transition-all"
              >
                Generate Digital QR Gate Pass
              </button>
            </form>
          </div>

          {/* Generated Gate Pass Display */}
          <div className="glass-panel p-6 flex flex-col justify-between space-y-4">
            <h3 className="text-sm font-bold text-slate-300 flex items-center justify-between">
              <span>Active Visitor Passes</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h3>

            {generatedPass ? (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/80 border border-indigo-500/40 text-center space-y-3 glow-indigo">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">URBANPULSE GATE ENTRY CODE</span>
                <div className="bg-white p-4 rounded-xl max-w-[160px] mx-auto border-4 border-indigo-400 shadow-inner">
                  {/* Simulated QR Code SVG */}
                  <svg className="w-full h-full text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="30" height="30" />
                    <rect x="70" y="0" width="30" height="30" />
                    <rect x="0" y="70" width="30" height="30" />
                    <rect x="10" y="10" width="10" height="10" fill="white" />
                    <rect x="80" y="10" width="10" height="10" fill="white" />
                    <rect x="10" y="80" width="10" height="10" fill="white" />
                    <rect x="40" y="40" width="20" height="20" />
                    <rect x="20" y="50" width="10" height="20" />
                    <rect x="60" y="20" width="10" height="30" />
                    <rect x="70" y="70" width="20" height="20" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-cyan-400 tracking-wider font-mono">{generatedPass.entryCode}</h4>
                  <p className="text-xs font-bold text-white mt-1">{generatedPass.visitorName}</p>
                  <p className="text-[11px] text-slate-400">{generatedPass.visitorType} • Flat A-402</p>
                </div>
                <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                  Share code or screenshot with visitor for instant gate entry approval.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {visitors.slice(0, 3).map(v => (
                  <div key={v.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-200">{v.visitorName}</p>
                      <p className="text-[10px] text-slate-400">{v.visitorType}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-indigo-400">{v.entryCode}</span>
                      <span className={`block text-[10px] font-semibold ${v.status === 'Checked In' ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {v.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 4: Notice Board */}
      {activeTab === 'notices' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" /> Digital Notice Board & Multilingual Broadcasts
            </h3>

            {/* Language Selector */}
            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिंदी' },
                { code: 'mr', label: 'मराठी' }
              ].map(l => (
                <button
                  key={l.code}
                  onClick={() => setNoticeLang(l.code)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    noticeLang === l.code ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {notices.map(n => (
              <div key={n.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                    {n.category}
                  </span>
                  <span className="text-slate-400">{n.date} • Posted by {n.postedBy}</span>
                </div>
                <h4 className="text-base font-bold text-white">{n.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  {n.translations?.[noticeLang] || n.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Society Dues & Payments */}
      {activeTab === 'dues' && (
        <div className="max-w-2xl mx-auto glass-panel p-6 space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Maintenance Dues & Digital Receipt Portal</h3>
              <p className="text-xs text-slate-400">Flat A-402 Maintenance Statements</p>
            </div>
          </div>

          <div className="space-y-3">
            {dues.map(d => (
              <div key={d.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{d.month} Maintenance</h4>
                  <p className="text-xs text-slate-400">Due Date: {d.dueDate}</p>
                  <p className="text-sm font-extrabold text-emerald-400 mt-1 font-mono">₹{d.amount.toLocaleString()}</p>
                </div>

                <div>
                  {d.status === 'Paid' ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      <CheckCircle className="w-3.5 h-3.5" /> Paid & Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => payDues(d.id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:opacity-90 shadow-md"
                    >
                      Pay ₹{d.amount} via UPI/Card
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
