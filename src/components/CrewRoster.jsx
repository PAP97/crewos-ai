import React, { useState } from 'react';
import { Sparkles, UserPlus, Shield, Check, Crown } from 'lucide-react';

export default function CrewRoster({ crewRoster, setCrewRoster }) {
  const [isAddingAgent, setIsAddingAgent] = useState(false);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [role, setRole] = useState('CUSTOM');
  const [avatar, setAvatar] = useState('🤖');
  const [description, setDescription] = useState('');

  const handleAddAgentSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !title.trim()) return;

    const newAgent = {
      id: `agent-${Date.now()}`,
      name,
      title,
      role: role.toUpperCase(),
      avatar: avatar || '🤖',
      color: '#a855f7',
      badgeClass: 'badge-planner',
      description,
      capabilities: ['Custom Logic', 'Strategic Support'],
      systemPrompt: `You are ${name}, ${title}. Assist the CEO with specialized expertise.`,
      status: 'Active'
    };

    setCrewRoster(prev => [...prev, newAgent]);
    setIsAddingAgent(false);
    setName('');
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Executive Crew Roster
            </div>
            <h2 className="text-2xl font-bold text-white">C-Suite Agent Management</h2>
            <p className="text-sm text-slate-400 mt-1">
              Inspect roles, permissions, and system prompts of your executive team. Add custom specialized agents tailored to your business needs.
            </p>
          </div>

          <button
            onClick={() => setIsAddingAgent(true)}
            className="btn-primary text-xs"
          >
            <UserPlus className="w-4 h-4" /> Recruited Custom Agent
          </button>
        </div>
      </div>

      {/* Grid of Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crewRoster.map((agent) => (
          <div 
            key={agent.id} 
            className={`glass-card p-6 space-y-4 relative ${
              agent.role === 'CEO' ? 'border-purple-500/50 bg-purple-950/20 glow-purple' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-slate-900 border border-slate-700/80 shadow-md">
                {agent.avatar}
              </div>
              <span className={`badge ${agent.badgeClass}`}>{agent.role}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{agent.name}</h3>
                {agent.role === 'CEO' && <Crown className="w-4 h-4 text-yellow-400" />}
              </div>
              <p className="text-xs font-medium text-purple-300 mt-0.5">{agent.title}</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/80 min-h-[60px]">
              {agent.description}
            </p>

            {/* Capabilities */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Core Capabilities
              </span>
              <div className="flex flex-wrap gap-1">
                {agent.capabilities.map((cap, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active Status
              </span>
              <span className="font-mono text-[11px]">ID: {agent.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Recruited Custom Agent */}
      {isAddingAgent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 space-y-4 border-purple-500/30">
            <h3 className="text-lg font-bold text-white">Recruit New Custom Agent to Crew</h3>
            <form onSubmit={handleAddAgentSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Agent Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vance Cross"
                  className="w-full text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Title / Executive Role</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chief Legal Officer / Growth Architect"
                  className="w-full text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Avatar Emoji</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="⚖️"
                    className="w-full text-xs text-center text-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Role Tag</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="LEGAL"
                    className="w-full text-xs uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Role Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Define what this agent focuses on during crew discussions..."
                  className="w-full text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingAgent(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Add Agent to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
