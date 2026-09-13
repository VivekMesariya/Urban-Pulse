import React, { useState } from 'react';
import { runVisionAIVerification } from '../services/aiEngine';
import { Eye, CheckCircle2, ShieldAlert, Sparkles, RefreshCw, Cpu, Layers } from 'lucide-react';

export const VisionAIVerifier = ({ ticket, onVerifyComplete }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [visionResult, setVisionResult] = useState(ticket.visionVerification || null);

  const handleRunAIAnalysis = async () => {
    setAnalyzing(true);
    const result = await runVisionAIVerification(ticket.beforeImage, ticket.afterImage, ticket.category);
    setVisionResult(result);
    setAnalyzing(false);
    if (onVerifyComplete) {
      onVerifyComplete(result);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-slate-950/80">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Vision AI Repair Verifier <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </h3>
            <p className="text-[11px] text-slate-400">Deep Visual Inspection of Repair Proof Photos</p>
          </div>
        </div>

        <button
          onClick={handleRunAIAnalysis}
          disabled={analyzing || !ticket.afterImage}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 shadow-md transition-all"
        >
          {analyzing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Scanning Feature Grids...</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>{visionResult ? 'Re-Run Vision AI' : 'Run Vision AI Analysis'}</span>
            </>
          )}
        </button>
      </div>

      {/* Before and After Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Before Repair */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-rose-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Before Repair (Issue Reported)
            </span>
          </div>
          <div className="relative rounded-xl overflow-hidden border border-rose-500/30 bg-slate-900 aspect-video group">
            <img 
              src={ticket.beforeImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'} 
              alt="Before Repair" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
              <span className="text-[10px] font-mono text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                Visual Defect Bounding Box Detected
              </span>
            </div>
          </div>
        </div>

        {/* After Repair */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> After Repair (Tech Upload)
            </span>
          </div>
          <div className="relative rounded-xl overflow-hidden border border-emerald-500/30 bg-slate-900 aspect-video group">
            {ticket.afterImage ? (
              <>
                <img 
                  src={ticket.afterImage} 
                  alt="After Repair" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {analyzing && (
                  <div className="absolute inset-x-0 h-1 bg-cyan-400 glow-cyan animate-scanline z-20"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    Proof Photo Active
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs p-4 text-center">
                <Layers className="w-8 h-8 mb-2 stroke-1 text-slate-600" />
                <p>No completion photo uploaded yet.</p>
                <p className="text-[10px] text-slate-600 mt-1">Tech must upload proof to trigger Vision AI validation.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vision AI Output Panel */}
      {visionResult && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {visionResult.isVerified ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-amber-400" />
              )}
              <span className={`text-xs font-bold ${visionResult.isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                {visionResult.status}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Match Confidence:</span>
              <span className="text-sm font-extrabold text-cyan-400 font-mono">{visionResult.verificationScore}%</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            {visionResult.analysisSummary}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {visionResult.detections?.map((d, idx) => (
              <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                ✓ {d}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
