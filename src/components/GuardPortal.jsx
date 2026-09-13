import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  QrCode, 
  UserCheck, 
  LogOut, 
  Search, 
  AlertTriangle, 
  Car, 
  Clock, 
  Check, 
  X,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GuardPortal = () => {
  const { visitors, scanGatePass, sosActive, setSosActive } = useApp();
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState(null);

  const handleScanSubmit = (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    const res = scanGatePass(scanInput);
    setScanResult(res);

    if (res.success) {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Main Gate Security Terminal</h2>
            <p className="text-xs text-slate-400">QR Code Gate Pass verification, Visitor Logbook, and Live Emergency Siren Monitor.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 font-mono">
            GATE #1 ACTIVE
          </div>
          <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            System Live
          </div>
        </div>
      </div>

      {/* Emergency Siren Alert Banner */}
      {sosActive && (
        <div className="p-5 rounded-2xl bg-rose-950/90 border-2 border-rose-600 animate-sos-pulse flex items-center justify-between glow-rose">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-rose-600 text-white animate-bounce">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs text-rose-300 font-bold uppercase tracking-widest">
                <Volume2 className="w-4 h-4 animate-pulse" /> CRITICAL SOS EMERGENCY SIREN TRIGGERED
              </div>
              <h3 className="text-lg font-black text-white">Flat {sosActive.flat} • Resident: {sosActive.resident}</h3>
              <p className="text-xs text-rose-200">Phone: {sosActive.phone} • Time: {sosActive.timestamp}</p>
            </div>
          </div>

          <button
            onClick={() => setSosActive(null)}
            className="px-4 py-2 rounded-xl bg-white text-rose-950 text-xs font-black hover:bg-rose-100 shadow-lg"
          >
            Acknowledge & Dispatch Guard
          </button>
        </div>
      )}

      {/* Main Scanner + Log Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gate Pass QR Code Terminal Scanner */}
        <div className="lg:col-span-1 glass-panel p-6 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <QrCode className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">QR Gate Pass Verification</h3>
          </div>

          <form onSubmit={handleScanSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Scan or Enter Gate Code</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. UP-8901"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-sm text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-bold uppercase"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-500"
                >
                  Verify
                </button>
              </div>
            </div>
          </form>

          {/* Quick Demo Pre-fill Buttons */}
          <div className="pt-2">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Quick Test Codes:</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {visitors.slice(0, 3).map(v => (
                <button
                  key={v.id}
                  onClick={() => setScanInput(v.entryCode)}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:text-cyan-400"
                >
                  {v.entryCode} ({v.visitorName.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>

          {/* Scan Result Box */}
          {scanResult && (
            <div className={`p-4 rounded-xl border text-xs space-y-2 animate-in fade-in duration-200 ${
              scanResult.success 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center space-x-2 font-bold text-sm">
                {scanResult.success ? <Check className="w-5 h-5 text-emerald-400" /> : <X className="w-5 h-5 text-rose-400" />}
                <span>{scanResult.message}</span>
              </div>

              {scanResult.pass && (
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-slate-300 space-y-1">
                  <p><strong>Visitor:</strong> {scanResult.pass.visitorName}</p>
                  <p><strong>Purpose:</strong> {scanResult.pass.visitorType}</p>
                  <p><strong>Target Flat:</strong> {scanResult.pass.flatNumber} ({scanResult.pass.hostName})</p>
                  <p><strong>Vehicle:</strong> {scanResult.pass.vehicleNumber || 'N/A'}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Visitor Register Logbook */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" /> Live Visitor Logbook & Vehicle Register
            </h3>
            <span className="text-xs text-slate-400">{visitors.length} Today</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Visitor / Purpose</th>
                  <th className="py-2.5 px-3">Destination</th>
                  <th className="py-2.5 px-3">Gate Code</th>
                  <th className="py-2.5 px-3">Vehicle</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {visitors.map(v => (
                  <tr key={v.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-200">{v.visitorName}</p>
                      <p className="text-[10px] text-slate-400">{v.visitorType}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-300">Flat {v.flatNumber}</p>
                      <p className="text-[10px] text-slate-500">{v.hostName}</p>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-cyan-400">{v.entryCode}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{v.vehicleNumber}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        v.status === 'Checked In' ? 'badge-verified' :
                        v.status === 'Checked Out' ? 'bg-slate-800 text-slate-400' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
