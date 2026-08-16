import React, { useState, useEffect } from 'react';
import { Server, ShieldCheck, Cpu, Play, Trash2, Plus, Sparkles, CheckCircle2, AlertTriangle, UserPlus, UserMinus, RefreshCw, Code, Terminal, Activity } from 'lucide-react';
import { MCP_SERVER_REGISTRY, getActiveSubAgents, spawnSubAgent, dismissSubAgent, evaluateDharmaEthics } from '../services/mcpRegistryService';

export default function MCPControlHub({ crewRoster }) {
  const [subAgents, setSubAgents] = useState([]);
  const [selectedMcpServer, setSelectedMcpServer] = useState(MCP_SERVER_REGISTRY[0].id);
  const [newSubRole, setNewSubRole] = useState('DevOps Engineer');
  const [newSubPurpose, setNewSubPurpose] = useState('Build staging environment sandbox');
  const [evalActionTitle, setEvalActionTitle] = useState('');
  const [evalResult, setEvalResult] = useState(null);

  useEffect(() => {
    setSubAgents(getActiveSubAgents());
  }, []);

  const handleSpawnSubAgentSubmit = (e) => {
    e.preventDefault();
    if (!newSubPurpose.trim()) return;

    const spawned = spawnSubAgent(
      selectedMcpServer,
      newSubRole.trim() || 'Specialist',
      newSubPurpose.trim(),
      newSubPurpose.trim()
    );

    setSubAgents(getActiveSubAgents());
    setNewSubPurpose('');
  };

  const handleDismissSubAgent = (subAgentId) => {
    dismissSubAgent(subAgentId);
    setSubAgents(getActiveSubAgents());
  };

  const handleRunEthicsEval = (e) => {
    e.preventDefault();
    if (!evalActionTitle.trim()) return;

    const result = evaluateDharmaEthics(evalActionTitle.trim(), 'Manual MCP Governance Evaluation');
    setEvalResult(result);
    setEvalActionTitle('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 border-purple-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
              <Cpu className="w-3.5 h-3.5" /> Model Context Protocol (MCP) Server Architecture
            </div>
            <h2 className="text-2xl font-bold text-white">Indian Executive MCP Server Control Hub</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              C-suite executives operate as modular MCP Servers (Aarav Varma, Ananya Sharma, Rohan Malhotra, Aditya Patel, Priya Iyer, Devansh Roy). Exposes tools to evaluate right vs wrong and autonomously spawn or dismiss sub-agents!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge badge-cso text-xs px-3 py-1.5 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" /> {MCP_SERVER_REGISTRY.length} MCP Servers Online
            </span>
          </div>
        </div>
      </div>

      {/* Grid: MCP Servers & Dharma Ethics Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Registered MCP Servers */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-400" /> Active Executive MCP Servers
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MCP_SERVER_REGISTRY.map((server) => (
              <div key={server.id} className="glass-card p-4 space-y-3 border-slate-800 hover:border-purple-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs text-purple-300">
                      MCP
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{server.serverName}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">v{server.version}</span>
                    </div>
                  </div>
                  <span className="badge badge-cfo text-[9px]">{server.status}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">JSON-RPC Exposed Tools ({server.tools.length})</span>
                  <div className="flex flex-wrap gap-1">
                    {server.tools.map((tool, tIdx) => (
                      <span key={tIdx} className="text-[9px] font-mono bg-slate-900 text-purple-300 px-1.5 py-0.5 rounded border border-slate-800">
                        {tool}()
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dharma Protocol Ethics Guardrail ("Right vs Wrong") */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Dharma Ethics Engine ("Right vs Wrong")
            </h3>
          </div>

          <div className="glass-card p-4 space-y-4 border-emerald-500/30 bg-emerald-950/10">
            <div className="space-y-1 text-xs text-slate-300">
              <p className="text-[11px] text-slate-400">
                Evaluates proposed actions for ethical compliance, data safety, and strategic truth before execution.
              </p>
            </div>

            <form onSubmit={handleRunEthicsEval} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Test Action / Directive</label>
                <input
                  type="text"
                  value={evalActionTitle}
                  onChange={(e) => setEvalActionTitle(e.target.value)}
                  placeholder="e.g. Delete user backups or Deploy staging build"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full text-xs py-2 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Evaluate Ethics & Correctness
              </button>
            </form>

            {evalResult && (
              <div className={`p-3 rounded-xl border text-xs space-y-1 animate-fadeIn ${
                evalResult.isEthical 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}>
                <div className="font-bold flex items-center justify-between">
                  <span>Verdict: {evalResult.verdict}</span>
                  <span className="text-[9px] font-mono opacity-75">Dharma Protocol</span>
                </div>
                <p className="text-[11px]">{evalResult.reasoning}</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Dynamic Sub-Agent Spawning & Dismissal Console */}
      <div className="glass-panel p-6 border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-400" /> Autonomous Sub-Agent Lifecycle Manager
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              MCP Servers can dynamically spawn specialized sub-agents for specific sub-tasks, and dismiss them when completed!
            </p>
          </div>

          <span className="text-xs font-mono text-purple-300 bg-purple-950/50 px-3 py-1 rounded-lg border border-purple-500/30">
            Active Sub-Agents: {subAgents.filter(a => a.status === 'ACTIVE').length}
          </span>
        </div>

        {/* Form to Spawn New Sub-Agent */}
        <form onSubmit={handleSpawnSubAgentSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">Spawning MCP Server</label>
            <select
              value={selectedMcpServer}
              onChange={(e) => setSelectedMcpServer(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              {MCP_SERVER_REGISTRY.map(s => (
                <option key={s.id} value={s.id}>{s.serverName} ({s.role})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">Sub-Agent Role</label>
            <input
              type="text"
              value={newSubRole}
              onChange={(e) => setNewSubRole(e.target.value)}
              placeholder="e.g. DevOps Specialist"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              required
            />
          </div>

          <div className="space-y-1 md:col-span-1">
            <label className="text-[11px] font-semibold text-slate-300">Sub-Task Purpose</label>
            <input
              type="text"
              value={newSubPurpose}
              onChange={(e) => setNewSubPurpose(e.target.value)}
              placeholder="e.g. Set up sandbox"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="btn-primary w-full text-xs py-2 flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" /> Spawn Sub-Agent
            </button>
          </div>
        </form>

        {/* Active & Dismissed Sub-Agents List */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sub-Agent Lifecycle Tree ({subAgents.length})</h4>

          {subAgents.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
              No active sub-agents currently spawned. Sub-agents will be dynamically created during execution directives!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {subAgents.map((agent) => (
                <div key={agent.id} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{agent.subAgentName}</span>
                      <span className="badge badge-cto text-[9px]">{agent.subAgentRole}</span>
                      {agent.status === 'ACTIVE' ? (
                        <span className="badge badge-cfo text-[9px] animate-pulse">ACTIVE</span>
                      ) : (
                        <span className="badge badge-cmo text-[9px]">DISMISSED</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">Purpose: {agent.purpose}</p>
                    <span className="text-[10px] text-slate-500 font-mono">Spawned by: {agent.parentLeaderName} ({agent.parentRole})</span>
                  </div>

                  {agent.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleDismissSubAgent(agent.id)}
                      className="btn-secondary text-[10px] py-1 px-2.5 text-rose-300 border-rose-500/30 hover:bg-rose-950/40 flex items-center gap-1 shrink-0"
                      title="Dismiss/Terminate Sub-Agent"
                    >
                      <UserMinus className="w-3 h-3 text-rose-400" /> Dismiss
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
