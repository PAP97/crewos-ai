import React from 'react';
import { 
  Users, 
  CheckSquare, 
  Database, 
  Layers, 
  Github, 
  Key, 
  Crown,
  Sparkles,
  Brain
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  pendingApprovalsCount, 
  memoryCount, 
  isGitHubConnected,
  onOpenGitHubSettings,
  onOpenApiKeyModal
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & CEO Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Crown className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                CrewOS <span className="text-xs px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800/50 font-mono">v3.0 Full AI</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Founder Command & Full Autonomous AI C-Suite Swarm
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800/90 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('BOARDROOM')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'BOARDROOM'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            Boardroom Huddle
          </button>

          <button
            onClick={() => setActiveTab('AI_HUB')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'AI_HUB'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Brain className="w-4 h-4 text-cyan-400" />
            Full AI Hub
          </button>

          <button
            onClick={() => setActiveTab('APPROVALS')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
              activeTab === 'APPROVALS'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            CEO Approvals
            {pendingApprovalsCount > 0 && (
              <span className="ml-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-bounce">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('MEMORY')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'MEMORY'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-4 h-4" />
            Shared Memory
            <span className="text-xs opacity-75 font-mono">({memoryCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('EXECUTION')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'EXECUTION'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            Execution Board
          </button>

          <button
            onClick={() => setActiveTab('ROSTER')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'ROSTER'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Crew Roster
          </button>
        </nav>

        {/* Action Controls & Settings */}
        <div className="flex items-center gap-2">
          {/* GitHub Config Button */}
          <button
            onClick={onOpenGitHubSettings}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isGitHubConnected
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title="Configure GitHub Repository Storage & Pages Sync"
          >
            <Github className="w-3.5 h-3.5" />
            {isGitHubConnected ? 'GitHub Synced' : 'Connect GitHub'}
          </button>

          {/* Model API Key Button */}
          <button
            onClick={onOpenApiKeyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all"
            title="Configure AI Models (Gemini / Simulated)"
          >
            <Key className="w-3.5 h-3.5 text-yellow-400" />
            AI Config
          </button>
        </div>

      </div>
    </header>
  );
}
