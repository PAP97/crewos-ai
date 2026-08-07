import React, { useState, useEffect } from 'react';
import { Play, MessageSquare, Send, Sparkles, ShieldCheck, ArrowRight, Check, Users, UserCheck, Trash2, Clock, Activity, AtSign, ChevronDown, ChevronUp, BrainCircuit } from 'lucide-react';
import { simulateBoardroomHuddle, handleCEOChatMessage, synthesizeProposal } from '../services/agentEngine';

const STORAGE_CHAT_KEY = 'crewos_boardroom_chat_history';

export default function Boardroom({ crewRoster, onProposalGenerated }) {
  const [topic, setTopic] = useState('');
  const [userChatInput, setUserChatInput] = useState('');
  const [isHuddling, setIsHuddling] = useState(false);
  const [huddleMessages, setHuddleMessages] = useState([]);
  const [activeFlowStep, setActiveFlowStep] = useState(null);
  const [expandedSubChatId, setExpandedSubChatId] = useState(null);

  // Selected crew members for conversation
  const [selectedAgentRoles, setSelectedAgentRoles] = useState(
    crewRoster.filter(a => a.role !== 'CEO').map(a => a.role)
  );

  // Load chat history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHAT_KEY);
      if (saved) {
        setHuddleMessages(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load chat history:', e);
    }
  }, []);

  // Persist chat history on updates
  useEffect(() => {
    if (huddleMessages.length > 0) {
      localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(huddleMessages));
    }
  }, [huddleMessages]);

  const handleClearChatHistory = () => {
    if (window.confirm('Clear current Boardroom transcript history?')) {
      setHuddleMessages([]);
      localStorage.removeItem(STORAGE_CHAT_KEY);
    }
  };

  const toggleAgentSelection = (role) => {
    if (selectedAgentRoles.includes(role)) {
      if (selectedAgentRoles.length > 1) {
        setSelectedAgentRoles(selectedAgentRoles.filter(r => r !== role));
      }
    } else {
      setSelectedAgentRoles([...selectedAgentRoles, role]);
    }
  };

  const handleSelectAllAgents = () => {
    setSelectedAgentRoles(crewRoster.filter(a => a.role !== 'CEO').map(a => a.role));
  };

  const handleTagAgentInput = (role) => {
    const tag = `@${role} `;
    if (!userChatInput.includes(tag)) {
      setUserChatInput(prev => `${tag}${prev}`);
    }
  };

  const toggleSubChatExpand = (msgId) => {
    setExpandedSubChatId(expandedSubChatId === msgId ? null : msgId);
  };

  const handleStartHuddle = async (e) => {
    e.preventDefault();
    if (!topic.trim() || isHuddling) return;

    setIsHuddling(true);
    setActiveFlowStep('STARTING');

    const activeCrew = crewRoster.filter(a => selectedAgentRoles.includes(a.role));

    await simulateBoardroomHuddle(
      activeCrew, 
      topic, 
      (newMessage) => {
        setHuddleMessages(prev => [...prev, newMessage]);
      },
      (stepRole) => {
        setActiveFlowStep(stepRole);
      }
    );

    setIsHuddling(false);
    setTimeout(() => setActiveFlowStep(null), 3000);
  };

  const handleSendCEOMessage = async (e) => {
    e.preventDefault();
    if (!userChatInput.trim() || isHuddling) return;

    const inputMsg = userChatInput;
    setUserChatInput('');
    setIsHuddling(true);
    setActiveFlowStep('CEO');

    await handleCEOChatMessage(
      inputMsg,
      crewRoster,
      topic || 'Strategic Q&A',
      huddleMessages,
      (newMsg) => {
        setHuddleMessages(prev => [...prev, newMsg]);
      },
      (stepRole) => {
        setActiveFlowStep(stepRole);
      }
    );

    setIsHuddling(false);
    setTimeout(() => setActiveFlowStep(null), 3000);
  };

  const handleSynthesizeProposal = () => {
    const activeTopic = topic.trim() || 'CEO Executive Initiative';
    const proposal = synthesizeProposal(activeTopic);
    onProposalGenerated(proposal);
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isToday) return `Today at ${timeStr}`;
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${timeStr}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 border-purple-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Interactive CEO & Pre-Response Thinking Huddle
            </div>
            <h2 className="text-2xl font-bold text-white">Boardroom Briefings & Internal Sub-Chats</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              When you ask general questions, Lead Representative Aria Vance consults the team in a separate internal sub-chat ("Think Before Talk") before delivering her unified answer!
            </p>
          </div>

          <div className="flex items-center gap-2">
            {huddleMessages.length > 0 && (
              <button
                onClick={handleClearChatHistory}
                className="btn-secondary text-xs text-rose-300 hover:text-rose-200 border-rose-500/30"
                title="Clear saved chat history"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear History
              </button>
            )}

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

        {/* Input Form for New Huddle Topic */}
        <form onSubmit={handleStartHuddle} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Launch an enterprise subscription tier for automated agent workflows..."
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
                Crew Processing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Convene Full Crew Huddle
              </>
            )}
          </button>
        </form>
      </div>

      {/* Visual CEO Directive Routing Tracker */}
      <div className="glass-panel p-4 border-slate-800 bg-slate-950/60 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-purple-400">
            <Activity className="w-4 h-4" /> CEO Request Flow & Routing Tracker
          </span>
          {activeFlowStep && (
            <span className="text-emerald-400 font-mono flex items-center gap-1 text-[11px] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active: {activeFlowStep}
            </span>
          )}
        </div>

        {/* Stepper Pipeline */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 pr-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap ${
            activeFlowStep === 'CEO' || activeFlowStep === 'STARTING'
              ? 'bg-purple-950 border-purple-500 text-purple-200 glow-purple animate-pulse'
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <span>👑</span> CEO Request
          </div>

          <span className="text-slate-600 font-bold">➔</span>

          {crewRoster.filter(a => a.role !== 'CEO').map((agent, idx) => {
            const isActive = activeFlowStep === agent.role || (activeFlowStep && activeFlowStep.includes(agent.role));

            return (
              <React.Fragment key={agent.role}>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-purple-900/80 border-purple-400 text-white shadow-lg shadow-purple-500/30 animate-bounce'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 opacity-80'
                }`}>
                  <span>{agent.avatar}</span>
                  <span>{agent.role}</span>
                </div>
                {idx < crewRoster.length - 2 && <span className="text-slate-600 font-bold">➔</span>}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Boardroom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left: Crew Roster Quick Access */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Executive Crew ({crewRoster.length - 1})
            </h3>
          </div>

          <div className="space-y-2">
            {crewRoster.filter(a => a.role !== 'CEO').map(agent => (
              <div 
                key={agent.id}
                onClick={() => handleTagAgentInput(agent.role)}
                className="glass-card p-3 flex items-center gap-3 cursor-pointer transition-all border border-slate-800 hover:border-purple-500/80 hover:bg-purple-950/20"
                title={`Click to tag @${agent.role}`}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base bg-slate-900 border border-slate-700">
                  {agent.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white truncate">{agent.name}</h4>
                    <span className={`badge ${agent.badgeClass} text-[9px] px-1.5 py-0.2`}>{agent.role}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{agent.title}</p>
                </div>
                <span className="text-[11px] text-purple-400 font-mono font-bold">+@</span>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-300 flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" /> Internal Crew Sub-Chat
            </span>
            <p>Group questions trigger an internal background sub-chat where crew members consult their Vector Brains before talking!</p>
          </div>
        </div>

        {/* Right: Live Interactive Boardroom Stream & Chat Box */}
        <div className="lg:col-span-3">
          <div className="glass-panel p-6 min-h-[480px] flex flex-col justify-between">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Live Persistent Boardroom Transcript</h3>
              </div>
              {huddleMessages.length > 0 && (
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> {huddleMessages.length} Messages Logged
                </span>
              )}
            </div>

            {/* Message Stream */}
            <div className="flex-1 space-y-4 overflow-y-auto max-h-[440px] pr-2">
              {huddleMessages.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-2xl">
                    🏛️
                  </div>
                  <h4 className="text-sm font-medium text-slate-300">Boardroom Transcript Empty</h4>
                  <p className="text-xs max-w-sm mt-1">
                    Convene a huddle above or type a message below to talk directly with your executive crew.
                  </p>
                </div>
              ) : (
                huddleMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`glass-card p-4 space-y-2 border-slate-800/80 ${
                      msg.agentRole === 'CEO' ? 'border-l-4 border-l-purple-500 bg-purple-950/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{msg.avatar}</span>
                        <div>
                          <span className="text-sm font-semibold text-white">{msg.agentName}</span>
                          <span className="text-xs text-slate-400 ml-2">({msg.agentRole})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-mono">
                          {formatTimestamp(msg.timestamp)}
                        </span>
                        <span className={`badge ${msg.badgeClass}`}>{msg.agentRole}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line pl-9">
                      {msg.content}
                    </p>

                    {/* Expandable Internal Sub-Chat Drawer ("Think Before Talk") */}
                    {msg.internalSubChatLog && msg.internalSubChatLog.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-800/80">
                        <button
                          type="button"
                          onClick={() => toggleSubChatExpand(msg.id)}
                          className="flex items-center justify-between w-full text-xs font-semibold text-cyan-400 bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800 hover:border-cyan-500/40 transition-all"
                        >
                          <span className="flex items-center gap-1.5">
                            <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                            Inspect Internal Crew Thinking Huddle ({msg.internalSubChatLog.length} Sub-Messages)
                          </span>
                          {expandedSubChatId === msg.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {expandedSubChatId === msg.id && (
                          <div className="mt-2 p-3 bg-slate-950/90 rounded-xl border border-cyan-500/30 space-y-2 text-xs animate-fadeIn">
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                              <span>Raw Sub-Chat Consultation Transcript</span>
                              <span className="text-cyan-400 font-mono text-[10px]">Vector Brain Queries Included</span>
                            </div>
                            {msg.internalSubChatLog.map((subMsg) => (
                              <div key={subMsg.id} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-semibold text-slate-200 flex items-center gap-1">
                                    <span>{subMsg.avatar}</span> {subMsg.agentName} ({subMsg.agentRole})
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono">{formatTimestamp(subMsg.timestamp)}</span>
                                </div>
                                <p className="text-[11px] text-slate-300 leading-relaxed font-mono">{subMsg.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>

            {/* CEO Interactive Chat Bar with Quick @Tags */}
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2.5">
              
              {/* Quick Tag Pills */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-400">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <AtSign className="w-3 h-3 text-purple-400" /> Tag Member:
                </span>
                {crewRoster.filter(a => a.role !== 'CEO').map(agent => (
                  <button
                    key={agent.role}
                    type="button"
                    onClick={() => handleTagAgentInput(agent.role)}
                    className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/40 text-[11px] font-mono text-purple-300 transition-all flex items-center gap-1"
                  >
                    <span>{agent.avatar}</span> @{agent.role}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSendCEOMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={userChatInput}
                  onChange={(e) => setUserChatInput(e.target.value)}
                  placeholder="Ask a question or tag a member (e.g. @CTO how is tech stack? or @CFO what is burn rate?)..."
                  className="flex-1 text-xs py-2.5 bg-slate-900 border border-slate-700/90 rounded-xl"
                  disabled={isHuddling}
                />
                <button
                  type="submit"
                  disabled={!userChatInput.trim() || isHuddling}
                  className="btn-primary text-xs py-2.5 px-4 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" /> Speak as CEO
                </button>
              </form>

              {/* Proposal Banner */}
              {huddleMessages.length > 0 && !isHuddling && (
                <div className="flex items-center justify-between bg-purple-950/20 p-3 rounded-xl border border-purple-500/20">
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
                    Create CEO Proposal <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
