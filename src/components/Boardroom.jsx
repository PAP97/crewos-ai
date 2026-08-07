import React, { useState } from 'react';
import { Play, MessageSquare, Send, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { simulateBoardroomHuddle, synthesizeProposal } from '../services/agentEngine';

export default function Boardroom({ crewRoster, onProposalGenerated }) {
  const [topic, setTopic] = useState('');
  const [isHuddling, setIsHuddling] = useState(false);
  const [huddleMessages, setHuddleMessages] = useState([]);
  const [activeAgentFilter, setActiveAgentFilter] = useState('ALL');

  const handleStartHuddle = async (e) => {
    e.preventDefault();
    if (!topic.trim() || isHuddling) return;

    setIsHuddling(true);
    setHuddleMessages([]);

    const activeCrew = crewRoster.filter(a => a.role !== 'CEO');

    await simulateBoardroomHuddle(activeCrew, topic, (newMessage) => {
      setHuddleMessages(prev => [...prev, newMessage]);
    });

    setIsHuddling(false);
  };

  const handleSynthesizeProposal = () => {
    if (!topic.trim()) return;
    const proposal = synthesizeProposal(topic);
    onProposalGenerated(proposal);
    setTopic('');
    setHuddleMessages([]);
  };

  const filteredMessages = activeAgentFilter === 'ALL'
    ? huddleMessages
    : huddleMessages.filter(m => m.agentRole === activeAgentFilter);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 border-purple-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Autonomous Boardroom Huddle
            </div>
            <h2 className="text-2xl font-bold text-white">Executive Team Huddle & Debate</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Pitch topics or strategic questions to your executive crew. The CSO, CTO, CFO, CMO, and Dev will debate, cross-examine using shared memory, and prepare a proposal for your approval.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {huddleMessages.length > 0 && !isHuddling && (
              <button
                onClick={handleSynthesizeProposal}
                className="btn-primary animate-bounce shadow-lg shadow-purple-600/40"
              >
                <ShieldCheck className="w-4 h-4" />
                Submit to CEO Approval Queue
              </button>
            )}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleStartHuddle} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Launch a subscription tier for automated social media marketing..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              disabled={isHuddling}
            />
          </div>
          <button
            type="submit"
            disabled={!topic.trim() || isHuddling}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isHuddling ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Crew Debating...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Convene Crew Huddle
              </>
            )}
          </button>
        </form>
      </div>

      {/* Main Boardroom Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left: Active Crew Members */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Executive Crew Attendees
          </h3>
          <div className="space-y-2">
            {crewRoster.filter(a => a.role !== 'CEO').map(agent => (
              <div 
                key={agent.id}
                onClick={() => setActiveAgentFilter(activeAgentFilter === agent.role ? 'ALL' : agent.role)}
                className={`glass-card p-3 flex items-center gap-3 cursor-pointer transition-all ${
                  activeAgentFilter === agent.role ? 'border-purple-500/80 bg-purple-950/30' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg bg-slate-800 border border-slate-700">
                  {agent.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white truncate">{agent.name}</h4>
                    <span className={`badge ${agent.badgeClass} text-[10px]`}>{agent.role}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{agent.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Huddle Stream */}
        <div className="lg:col-span-3">
          <div className="glass-panel p-6 min-h-[420px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Live Boardroom Transcript</h3>
              </div>
              {huddleMessages.length > 0 && (
                <span className="text-xs text-slate-400 font-mono">
                  {huddleMessages.length} Contributions
                </span>
              )}
            </div>

            {/* Transcript Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[460px] pr-2">
              {huddleMessages.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-2xl">
                    🏛️
                  </div>
                  <h4 className="text-sm font-medium text-slate-300">Boardroom Table Empty</h4>
                  <p className="text-xs max-w-sm mt-1">
                    Type a business goal or feature idea above and click "Convene Crew Huddle" to watch your executive team analyze and debate.
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div key={msg.id} className="glass-card p-4 space-y-2 border-slate-800/80 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{msg.avatar}</span>
                        <div>
                          <span className="text-sm font-semibold text-white">{msg.agentName}</span>
                          <span className="text-xs text-slate-400 ml-2">({msg.agentRole})</span>
                        </div>
                      </div>
                      <span className={`badge ${msg.badgeClass}`}>{msg.agentRole}</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line pl-9">
                      {msg.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Call to Action */}
            {huddleMessages.length > 0 && !isHuddling && (
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between bg-purple-950/20 p-3 rounded-xl border border-purple-500/20">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Consensus Formulated</h4>
                    <p className="text-[11px] text-slate-400">Ready to create a formal proposal for CEO authorization.</p>
                  </div>
                </div>
                <button
                  onClick={handleSynthesizeProposal}
                  className="btn-approve text-xs"
                >
                  Create Proposal <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
