import React, { useState, useEffect } from 'react';
import { Cpu, Brain, ShieldCheck, Database, Zap, RefreshCw, Terminal, CheckCircle2, Sparkles, Sliders, Layers, UserCheck } from 'lucide-react';
import { getFullAiAgentsConfig, executeFullAiAgentReasoning } from '../services/fullAiAgentService';

export default function FullAiControlHub() {
  const [agents, setAgents] = useState([]);
  const [selectedAgentRole, setSelectedAgentRole] = useState('CEO');
  const [testPrompt, setTestPrompt] = useState('Evaluate launch of Enterprise AI Tier');
  const [testResult, setTestResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    setAgents(getFullAiAgentsConfig());
  }, []);

  const handleTestExecution = async (e) => {
    e.preventDefault();
    if (!testPrompt.trim() || isExecuting) return;

    setIsExecuting(true);
    setTestResult(null);

    const res = await executeFullAiAgentReasoning(selectedAgentRole, testPrompt.trim());
    setTestResult(res);
    setIsExecuting(false);
  };

  const selectedAgent = agents.find(a => a.role === selectedAgentRole) || agents[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 border-purple-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
              <Brain className="w-3.5 h-3.5" /> Full Autonomous AI Agent Engine
            </div>
            <h2 className="text-2xl font-bold text-white">Autonomous AI C-Suite Command Center</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Each executive persona (CEO, CPO, CTO, CMO, CFO, QA) operates as a full autonomous AI agent with dedicated LLM reasoning, individual vector memory banks, and real-time execution!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge badge-cso text-xs px-3 py-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> 6 Autonomous AI Engines Active
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 6 Autonomous AI Agents Roster */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-400" /> Core Autonomous AI Executive Engines
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div 
              key={agent.id} 
              onClick={() => setSelectedAgentRole(agent.role)}
              className={`glass-card p-4 space-y-3 cursor-pointer transition-all border ${
                selectedAgentRole === agent.role
                  ? 'border-purple-500 bg-purple-950/20 shadow-lg shadow-purple-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{agent.avatar}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{agent.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{agent.title}</span>
                  </div>
                </div>
                <span className="badge badge-cfo text-[9px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> ONLINE
                </span>
              </div>

              <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Model Engine:</span>
                  <span className="text-purple-300 font-mono text-[10px]">{agent.modelEngine}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Temp / Creativity:</span>
                  <span className="text-cyan-300 font-mono text-[10px]">{agent.temperature}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Vector Memories:</span>
                  <span className="text-amber-300 font-mono text-[10px]">{agent.memoryCount} items</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Autonomous Capabilities</span>
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.map((cap, cIdx) => (
                    <span key={cIdx} className="text-[9px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive AI Agent Reasoning Inspection & Test Console */}
      {selectedAgent && (
        <div className="glass-panel p-6 border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedAgent.avatar}</span>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {selectedAgent.name} — Reasoning Inspector
                </h3>
                <p className="text-xs text-slate-400">
                  Inspect System Prompt, LLM temperature settings, and trigger live agent reasoning execution.
                </p>
              </div>
            </div>

            <span className="badge badge-cso text-xs font-mono">
              Role: {selectedAgent.role}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* System Prompt & Config */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" /> System Prompt & Core Context
              </h4>
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
                {selectedAgent.systemPrompt}
              </div>
            </div>

            {/* Test Execution Form */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Test AI Agent Reasoning Execution
              </h4>

              <form onSubmit={handleTestExecution} className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Prompt Directive</label>
                  <input
                    type="text"
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    placeholder="e.g. Evaluate pricing model or build DB schema"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    disabled={isExecuting}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isExecuting || !testPrompt.trim()}
                  className="btn-primary w-full text-xs py-2 flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" /> 
                  {isExecuting ? 'Running Reasoning Engine...' : `Run ${selectedAgent.role} AI Reasoning`}
                </button>
              </form>

              {testResult && (
                <div className="p-3 bg-purple-950/30 border border-purple-500/40 rounded-xl text-xs space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between font-bold text-purple-200">
                    <span>{testResult.agent.name} Output</span>
                    <span className="text-[9px] font-mono opacity-75">{new Date(testResult.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                    {testResult.reasoningOutput}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
