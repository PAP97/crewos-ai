import React, { useState } from 'react';
import { Github, CheckCircle2, AlertTriangle, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { testGitHubConnection, saveGitHubConfig } from '../services/githubService';

export default function GitHubSettingsModal({ config, setConfig, onClose }) {
  const [token, setToken] = useState(config.token || '');
  const [repo, setRepo] = useState(config.repo || '');
  const [branch, setBranch] = useState(config.branch || 'main');
  const [autoSync, setAutoSync] = useState(config.autoSync ?? true);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTestConnection = async (e) => {
    e.preventDefault();
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await testGitHubConnection({ token, repo, branch });
      setTestResult({ success: true, message: `Successfully connected to repository ${res.fullName}!`, data: res });
    } catch (err) {
      setTestResult({ success: false, message: err.message || 'Failed to connect to GitHub.' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = () => {
    const newConfig = { token, repo, branch, autoSync };
    saveGitHubConfig(newConfig);
    setConfig(newConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-lg w-full p-6 space-y-5 border-emerald-500/30 relative">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl">
            <Github className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">GitHub Persistence & Hosting Integration</h3>
            <p className="text-xs text-slate-400">Store crew memory, logs, and host on GitHub Pages</p>
          </div>
        </div>

        <form onSubmit={handleTestConnection} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              GitHub Personal Access Token (PAT)
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full text-xs font-mono"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Requires <code>repo</code> scope permission to read/write memory files and artifacts.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              GitHub Repository (owner/repo-name)
            </label>
            <input
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="yourusername/my-crewos-memory"
              className="w-full text-xs font-mono"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Branch</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full text-xs font-mono"
              />
            </div>
            
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500"
                />
                Auto-sync memory on changes
              </label>
            </div>
          </div>

          {testResult && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              testResult.success ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
            }`}>
              {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              {testResult.message}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="submit"
              disabled={isTesting || !token || !repo}
              className="btn-secondary text-xs"
            >
              {isTesting ? 'Testing Repo Access...' : 'Test Connection'}
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveConfig}
                className="btn-approve text-xs"
              >
                Save Integration
              </button>
            </div>
          </div>

        </form>

        {/* GitHub Pages Host Guide */}
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1 font-bold text-slate-200">
            <ExternalLink className="w-3.5 h-3.5 text-purple-400" /> Host on GitHub Pages (Zero Backend)
          </div>
          <p>
            Build your app using <code>npm run build</code> and push the <code>dist</code> folder to your GitHub repo to launch your crew live on GitHub Pages!
          </p>
        </div>

      </div>
    </div>
  );
}
