import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VisionAIVerifier } from './VisionAIVerifier';
import { 
  Wrench, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Upload, 
  Camera, 
  Layers, 
  Filter,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const StaffPortal = () => {
  const { complaints, updateTicketStatus } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTicket, setActiveTicket] = useState(null);

  // Tech upload state
  const [afterImageInput, setAfterImageInput] = useState('');
  const [techNotes, setTechNotes] = useState('');
  const [partsUsed, setPartsUsed] = useState('');

  const categories = ['All', 'Plumbing', 'Electrical', 'Elevator', 'Civil'];

  const filteredTickets = complaints.filter(t => {
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
    return true;
  });

  const handleStatusChange = (newStatus) => {
    if (!activeTicket) return;

    updateTicketStatus(activeTicket.id, {
      status: newStatus,
      afterImage: afterImageInput || activeTicket.afterImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
    });

    setActiveTicket(prev => ({
      ...prev,
      status: newStatus,
      afterImage: afterImageInput || prev.afterImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
    }));

    if (newStatus === 'Resolved') {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleVisionVerificationComplete = (result) => {
    if (activeTicket && result.isVerified) {
      updateTicketStatus(activeTicket.id, {
        visionVerification: result,
        status: 'Resolved'
      });
      setActiveTicket(prev => ({
        ...prev,
        visionVerification: result,
        status: 'Resolved'
      }));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-violet-950/40 to-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Technician & Maintenance Staff Workspace</h2>
            <p className="text-xs text-slate-400">View work orders, update repair status, upload proof photos, and run Vision AI validation.</p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white shadow-md glow-violet'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Work Order Queue List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Work Orders ({filteredTickets.length})</span>
            <span className="text-violet-400">Ramesh (Lead Technician)</span>
          </div>

          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredTickets.map(t => {
              const isSelected = activeTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setActiveTicket(t);
                    setAfterImageInput(t.afterImage || '');
                  }}
                  className={`glass-card p-4 cursor-pointer transition-all border ${
                    isSelected ? 'border-violet-500 bg-violet-950/40 glow-violet' : 'border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs font-extrabold text-violet-400">{t.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.priority === 'Critical' ? 'badge-critical' :
                      t.priority === 'High' ? 'badge-high' : 'badge-medium'
                    }`}>
                      {t.priority}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mt-1.5">{t.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{t.description}</p>
                  
                  <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                    <span>{t.residentName} ({t.flatNumber})</span>
                    <span className={`font-semibold ${t.status === 'Resolved' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Work Order Action Panel */}
        <div className="lg:col-span-2 space-y-4">
          {activeTicket ? (
            <div className="glass-panel p-6 space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <span className="font-mono text-xs font-extrabold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/30">
                    WORK ORDER {activeTicket.id}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">{activeTicket.title}</h3>
                  <p className="text-xs text-slate-400">Reported by {activeTicket.residentName} • Flat {activeTicket.flatNumber}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleStatusChange('In Progress')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30"
                  >
                    Mark In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange('Resolved')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>

              {/* Upload After-Repair Photo */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-violet-400" /> Technician Completion Photo Upload
                  </h4>
                  <span className="text-[10px] text-slate-400">Required for Vision AI Verification</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Enter After Repair Photo URL (or click demo preset)"
                    value={afterImageInput}
                    onChange={(e) => setAfterImageInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                  <button
                    onClick={() => {
                      const demoImg = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80';
                      setAfterImageInput(demoImg);
                      handleStatusChange('In Progress');
                    }}
                    className="px-3 py-2 rounded-xl bg-violet-600/30 text-violet-300 text-xs font-semibold border border-violet-500/30 hover:bg-violet-600/50"
                  >
                    Load Demo Photo
                  </button>
                </div>
              </div>

              {/* Vision AI Interactive Inspector */}
              <VisionAIVerifier 
                ticket={activeTicket} 
                onVerifyComplete={handleVisionVerificationComplete}
              />

              {/* Log Work & Spare Parts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Technician Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Log work completed, root cause..."
                    value={techNotes}
                    onChange={(e) => setTechNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Spare Parts / Materials Used</label>
                  <input
                    type="text"
                    placeholder="e.g. 1/2 inch PVC coupling, Teflon tape"
                    value={partsUsed}
                    onChange={(e) => setPartsUsed(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-slate-500 space-y-3">
              <Wrench className="w-12 h-12 mx-auto stroke-1 text-violet-400" />
              <h3 className="text-sm font-bold text-slate-300">Select a Work Order from Queue</h3>
              <p className="text-xs max-w-sm mx-auto">
                Click any work order on the left to upload repair completion proof and run the Vision AI validator.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
