import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ResidentPortal } from './components/ResidentPortal';
import { StaffPortal } from './components/StaffPortal';
import { GuardPortal } from './components/GuardPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { Building2, Sparkles, ShieldCheck, Heart } from 'lucide-react';

const MainContent = () => {
  const { role } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 lg:px-8 pb-12">
          {role === 'resident' && <ResidentPortal />}
          {role === 'staff' && <StaffPortal />}
          {role === 'guard' && <GuardPortal />}
          {role === 'admin' && <AdminDashboard />}
        </main>
      </div>

      {/* Modern Footer for College Final Year Project Presentation */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-200">URBANPULSE</span>
            <span>• College Final Year Mega Project</span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">React 18</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Vision AI</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">NLP Triage</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">QR Gate Pass</span>
          </div>

          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Smart Urban Residential Communities
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
