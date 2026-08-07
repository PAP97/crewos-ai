import React, { useState } from 'react';
import { Key, Sparkles, X, Check } from 'lucide-react';
import { getApiKeyConfig, saveApiKeyConfig } from '../services/agentEngine';

export default function ApiKeyModal({ onClose }) {
  const current = getApiKeyConfig();
  const [provider, setProvider] = useState(current.provider || 'SIMULATED');
  const [apiKey, setApiKey] = useState(current.apiKey || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    saveApiKeyConfig({ provider, apiKey });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full p-6 space-y-5 border-purple-500/30 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl">
            <Key className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Engine Configuration</h3>
            <p className="text-xs text-slate-400">Choose between live AI inference or instant built-in engine</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Execution Mode</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full text-xs"
            >
              <option value="SIMULATED">⚡ Instant Autonomous Crew Engine (Zero Setup / Default)</option>
              <option value="GEMINI">✨ Google Gemini API (Live Multi-Agent LLM)</option>
            </select>
          </div>

          {provider === 'GEMINI' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Gemini API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full text-xs font-mono"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Key is stored securely in browser local storage and never leaves your device.
              </p>
            </div>
          )}

          {saved && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4" /> AI Engine Settings Saved!
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">Cancel</button>
            <button type="submit" className="btn-primary text-xs">Save Settings</button>
          </div>
        </form>
      </div>
    </div>
  );
}
