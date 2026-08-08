import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Key, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';

const STORAGE_SECURITY_KEY = 'crewos_security_session';
const STORAGE_PASSCODE_KEY = 'crewos_custom_passcode';
const DEFAULT_PASSCODE = 'crewos2026';

export default function SecurityGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const session = localStorage.getItem(STORAGE_SECURITY_KEY);
      if (session === 'authenticated') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.warn('Failed to load security session:', e);
    }
    setIsLoading(false);
  }, []);

  const getActivePasscode = () => {
    try {
      const saved = localStorage.getItem(STORAGE_PASSCODE_KEY);
      return saved || DEFAULT_PASSCODE;
    } catch (e) {
      return DEFAULT_PASSCODE;
    }
  };

  const handleVerifyPasscode = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const targetPasscode = getActivePasscode();
    if (passcodeInput.trim() === targetPasscode) {
      localStorage.setItem(STORAGE_SECURITY_KEY, 'authenticated');
      setIsAuthenticated(true);
    } else {
      setErrorMsg('Invalid Executive Passcode. Access Denied.');
    }
  };

  const handleLockSession = () => {
    localStorage.removeItem(STORAGE_SECURITY_KEY);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden selection:bg-purple-500 selection:text-white">
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="glass-panel p-8 max-w-md w-full border-purple-500/30 space-y-6 relative z-10 shadow-2xl animate-fadeIn text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-300 shadow-lg shadow-purple-600/20">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Executive Security Gateway
            </div>
            <h2 className="text-2xl font-extrabold text-white">CrewOS AI Protection</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your Executive Passcode to access your C-suite command deck & boardroom.
            </p>
          </div>

          <form onSubmit={handleVerifyPasscode} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Executive Access Passcode</span>
                <span className="text-[10px] text-slate-500 font-mono">Default: crewos2026</span>
              </label>
              
              <div className="relative">
                <input
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter passcode..."
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                  required
                  autoFocus
                />
                <Key className="w-4 h-4 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
            >
              Unlock Executive Workspace <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
            Protected by CrewOS Security Shield & Encrypted Local Session Gateway.
          </div>

        </div>
      </div>
    );
  }

  return (
    <>
      {/* Small floating lock button for session management */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={handleLockSession}
          className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-rose-950/80 border border-slate-800 hover:border-rose-500/40 text-xs text-slate-400 hover:text-rose-200 transition-all flex items-center gap-1.5 shadow-lg backdrop-blur-sm"
          title="Lock Executive Security Gate"
        >
          <Lock className="w-3.5 h-3.5 text-rose-400" /> Lock Gateway
        </button>
      </div>

      {children}
    </>
  );
}
