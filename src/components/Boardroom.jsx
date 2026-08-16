import React, { useState, useEffect } from 'react';
import { Play, MessageSquare, Send, Sparkles, ShieldCheck, ArrowRight, Check, Users, UserCheck, Trash2, Clock, Activity, AtSign, ChevronDown, ChevronUp, BrainCircuit, Compass, AlertCircle, CheckCircle2, RefreshCw, GitPullRequest, Briefcase, Plus, Hash, Lock, Search, Paperclip, Mic, X, Layers, Cpu, UserPlus, FileText } from 'lucide-react';
import { simulateBoardroomHuddle, handleCEOChatMessage, synthesizeProposal } from '../services/agentEngine';
import { syncSubTaskToGitHubProjects } from '../services/cooWorkflowService';
import { executeIterativeQAReworkLoop } from '../services/businessAnalystService';

const STORAGE_CHAT_KEY = 'crewos_boardroom_chat_history';
const STORAGE_CHANNELS_KEY = 'crewos_boardroom_channels';

const DEFAULT_CHANNELS = [
  {
    id: 'chan-general',
    name: 'executive-boardroom',
    description: 'Main C-suite operational channel for all executive directives and huddling.',
    isPrivate: false,
    members: ['CEO', 'COO', 'CSO', 'CTO', 'CMO', 'CFO', 'DEV']
  },
  {
    id: 'chan-ceo-coo',
    name: 'ceo-coo-direct-line',
    description: 'Direct operational channel between CEO and COO Orion Vance.',
    isPrivate: true,
    members: ['CEO', 'COO']
  },
  {
    id: 'chan-tech',
    name: 'tech-and-architecture',
    description: 'Technical audits, code sprints, and system infrastructure.',
    isPrivate: false,
    members: ['CEO', 'COO', 'CTO', 'DEV']
  },
  {
    id: 'chan-finance',
    name: 'finance-and-gtm',
    description: 'Budget allocation, payback modeling, and GTM marketing campaigns.',
    isPrivate: false,
    members: ['CEO', 'COO', 'CFO', 'CMO']
  }
];

export default function Boardroom({ crewRoster, onProposalGenerated }) {
  const [channels, setChannels] = useState(DEFAULT_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState('chan-general');
  const [topic, setTopic] = useState('');
  const [userChatInput, setUserChatInput] = useState('');
  const [isHuddling, setIsHuddling] = useState(false);
  const [huddleMessages, setHuddleMessages] = useState([]);
  const [activeFlowStep, setActiveFlowStep] = useState(null);
  const [expandedSubChatId, setExpandedSubChatId] = useState(null);
  const [expandedSprintsId, setExpandedSprintsId] = useState(null);
  const [ghSyncStatus, setGhSyncStatus] = useState({});

  // New Channel Creation Modal State
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const [selectedChannelMembers, setSelectedChannelMembers] = useState(
    crewRoster.map(a => a.role)
  );

  // Load chat history & custom channels on mount
  useEffect(() => {
    try {
      const savedChat = localStorage.getItem(STORAGE_CHAT_KEY);
      if (savedChat) {
        setHuddleMessages(JSON.parse(savedChat));
      } else {
        // Initial Fresh Welcome Message
        setHuddleMessages([{
          id: 'msg-init-fresh',
          timestamp: new Date().toISOString(),
          agentId: 'agent-ceo',
          agentName: 'Executive Boardroom',
          agentRole: 'CEO',
          avatar: '👑',
          color: '#8b5cf6',
          badgeClass: 'badge-ceo',
          content: `### [Boardroom Status: ONLINE]\nWelcome Founder! The Executive Startup Boardroom is initialized with your Core 6 Personas:\n• 👑 **CEO (Strategic Visionary)** — Direction, PMF & velocity.\n• 🎨 **CPO (User Advocate)** — User journeys & UX friction elimination.\n• ⚡ **CTO (Systems Architect)** — Scalable architecture, security & MCP servers.\n• 📢 **CMO (Growth Hacker)** — GTM positioning & low CAC customer acquisition.\n• 💎 **CFO (Fiscal Guardian)** — Unit economics, gross margins & runway.\n• 🛡️ **QA (Break-It Expert)** — Automated test-driven validation & self-correction.\n\nType your strategic directive below to initiate a multi-agent debate and agentic execution loop!`
        }]);
      }

      const savedChan = localStorage.getItem(STORAGE_CHANNELS_KEY);
      if (savedChan) setChannels(JSON.parse(savedChan));
    } catch (e) {
      console.warn('Failed to load chat/channels from storage:', e);
    }
  }, []);

  // Persist chat history & channels
  useEffect(() => {
    if (huddleMessages.length > 0) {
      localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(huddleMessages));
    }
  }, [huddleMessages]);

  useEffect(() => {
    if (channels.length > 0) {
      localStorage.setItem(STORAGE_CHANNELS_KEY, JSON.stringify(channels));
    }
  }, [channels]);

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];

  const handleClearChatHistory = () => {
    if (window.confirm('Erase all chat history and start a fresh session?')) {
      localStorage.removeItem(STORAGE_CHAT_KEY);
      setHuddleMessages([{
        id: `msg-fresh-${Date.now()}`,
        timestamp: new Date().toISOString(),
        agentId: 'agent-ceo',
        agentName: 'Executive Boardroom',
        agentRole: 'CEO',
        avatar: '👑',
        color: '#8b5cf6',
        badgeClass: 'badge-ceo',
        content: `### [Boardroom Status: FRESH SESSION STARTED]\nAll previous transcripts erased. The Executive Startup Boardroom (CEO, CPO, CTO, CMO, CFO, QA) is ready for your next directive!`
      }]);
    }
  };

  const handleCreateChannelSubmit = (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const formattedName = newChannelName.toLowerCase().replace(/\s+/g, '-');
    const newChan = {
      id: `chan-${Date.now()}`,
      name: formattedName,
      description: newChannelDesc.trim() || 'Custom Executive Group Channel',
      isPrivate: false,
      members: Array.from(new Set(['CEO', ...selectedChannelMembers]))
    };

    setChannels(prev => [...prev, newChan]);
    setActiveChannelId(newChan.id);
    setNewChannelName('');
    setNewChannelDesc('');
    setIsCreateChannelOpen(false);
  };

  const toggleMemberSelection = (role) => {
    if (selectedChannelMembers.includes(role)) {
      setSelectedChannelMembers(selectedChannelMembers.filter(r => r !== role));
    } else {
      setSelectedChannelMembers([...selectedChannelMembers, role]);
    }
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

  const toggleSprintsExpand = (msgId) => {
    setExpandedSprintsId(expandedSprintsId === msgId ? null : msgId);
  };

  const handleStartHuddle = async (e) => {
    e.preventDefault();
    if (!topic.trim() || isHuddling) return;

    setIsHuddling(true);
    setActiveFlowStep('Convening Boardroom Huddle...');

    const activeCrew = crewRoster.filter(a => activeChannel.members.includes(a.role) && a.role !== 'CEO');

    await simulateBoardroomHuddle(
      activeCrew, 
      topic, 
      (newMessage) => {
        setHuddleMessages(prev => [...prev, { ...newMessage, channelId: activeChannelId }]);
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
    setActiveFlowStep('COO Orion & Aria Vance (BA): Company Analysis...');

    const channelCrew = crewRoster.filter(a => activeChannel.members.includes(a.role));

    await handleCEOChatMessage(
      inputMsg,
      channelCrew,
      topic || 'Strategic Q&A',
      huddleMessages.filter(m => m.channelId === activeChannelId),
      (newMsg) => {
        setHuddleMessages(prev => [...prev, { ...newMsg, channelId: activeChannelId }]);
      },
      (stepRole) => {
        setActiveFlowStep(stepRole);
      }
    );

    setIsHuddling(false);
    setTimeout(() => setActiveFlowStep(null), 3000);
  };

  const handleIterativeQARework = (msgId, sprintIdx, taskId) => {
    setHuddleMessages(prev => prev.map(msg => {
      if (msg.id !== msgId || !msg.agileSprints) return msg;

      const updatedSprints = msg.agileSprints.map((sprint, sIdx) => {
        if (sIdx !== sprintIdx) return sprint;

        const updatedSubTasks = sprint.subTasks.map(st => {
          if (st.id !== taskId) return st;
          // Execute iterative QA rework pass
          return executeIterativeQAReworkLoop(st, 'GOOD PASS: Rework complete after iteration.');
        });

        return { ...sprint, subTasks: updatedSubTasks };
      });

      return { ...msg, agileSprints: updatedSprints };
    }));
  };

  const handlePushSubTaskToGitHub = async (taskId, subTask) => {
    setGhSyncStatus(prev => ({ ...prev, [taskId]: 'syncing' }));

    try {
      const savedGh = localStorage.getItem('crewos_github_config');
      const gitHubConfig = savedGh ? JSON.parse(savedGh) : { token: '', repo: 'PAP97/crewos-ai' };

      const res = await syncSubTaskToGitHubProjects(gitHubConfig, subTask);

      if (res.success) {
        setGhSyncStatus(prev => ({ ...prev, [taskId]: 'success' }));
        setHuddleMessages(prevMsgs => prevMsgs.map(m => {
          if (!m.agileSprints) return m;
          return {
            ...m,
            agileSprints: m.agileSprints.map(s => ({
              ...s,
              subTasks: s.subTasks.map(st => st.id === taskId ? { ...st, githubIssueUrl: res.githubIssueUrl } : st)
            }))
          };
        }));
      } else {
        alert(`GitHub Sync Notice: ${res.message || 'Please configure GitHub Token in Settings'}`);
        setGhSyncStatus(prev => ({ ...prev, [taskId]: 'idle' }));
      }
    } catch (e) {
      setGhSyncStatus(prev => ({ ...prev, [taskId]: 'idle' }));
    }
  };

  const handleSynthesizeProposal = () => {
    const activeTopic = topic.trim() || 'CEO Executive Initiative';
    const proposal = synthesizeProposal(activeTopic);
    onProposalGenerated(proposal);
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return timeStr;
  };

  const currentChannelMessages = huddleMessages.filter(
    m => !m.channelId || m.channelId === activeChannelId
  );

  return (
    <div className="space-y-6">
      
      {/* Teams Style Boardroom Main Layout */}
      <div className="glass-panel border-slate-800 bg-slate-950/90 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[640px]">
        
        {/* Left Teams Sidebar: Channels & Group Chats */}
        <div className="lg:w-80 border-r border-slate-800/90 bg-slate-900/60 flex flex-col justify-between">
          
          <div>
            {/* Teams Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  T
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1">
                    CrewOS Teams Workspace
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">MS Teams Style Command</span>
                </div>
              </div>

              <button
                onClick={() => setIsCreateChannelOpen(true)}
                className="w-7 h-7 rounded-lg bg-purple-600/30 hover:bg-purple-600 border border-purple-500/40 text-purple-200 hover:text-white flex items-center justify-center transition-all"
                title="Create New Channel / Group Chat"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Channels List */}
            <div className="p-3 space-y-1">
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Executive Channels ({channels.length})</span>
                <span className="text-purple-400 text-[10px] font-mono">Live Sync</span>
              </div>

              <div className="space-y-1">
                {channels.map((chan) => {
                  const isActive = chan.id === activeChannelId;
                  return (
                    <button
                      key={chan.id}
                      onClick={() => setActiveChannelId(chan.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-purple-600/30 border border-purple-500/50 text-white font-semibold shadow-md'
                          : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {chan.isPrivate ? <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" /> : <Hash className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                        <span className="text-xs truncate">{chan.name}</span>
                      </div>

                      <span className="text-[10px] text-slate-500 font-mono">
                        {chan.members.length}👥
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Channel Roster Preview */}
            <div className="p-3 border-t border-slate-800/80">
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Group Members ({activeChannel.members.length})
              </div>
              <div className="mt-2 space-y-1.5">
                {crewRoster.filter(a => activeChannel.members.includes(a.role)).map(agent => (
                  <div 
                    key={agent.id}
                    onClick={() => handleTagAgentInput(agent.role)}
                    className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-purple-950/30 cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{agent.avatar}</span>
                      <span className="text-slate-300 font-medium">{agent.name}</span>
                    </div>
                    <span className={`badge ${agent.badgeClass} text-[9px] px-1.5 py-0.2`}>{agent.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-300 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-sky-400" /> Lead BA & Prerequisites Analysis
            </span>
            <p>Orion & Aria analyze dev space, tools, and talent gaps before breaking projects into Agile Sprints!</p>
          </div>
        </div>

        {/* Right Teams Main Chat Area */}
        <div className="flex-1 flex flex-col justify-between bg-slate-950/80">
          
          {/* Teams Channel Header */}
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/40">
            <div>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-bold text-white">{activeChannel.name}</h3>
                <span className="badge badge-cso text-[10px]">{activeChannel.members.length} Members</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{activeChannel.description}</p>
            </div>

            <div className="flex items-center gap-2">
              {currentChannelMessages.length > 0 && (
                <button
                  onClick={handleClearChatHistory}
                  className="btn-secondary text-[11px] py-1 px-2.5 text-rose-300 border-rose-500/30"
                  title="Clear channel transcript"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}

              {currentChannelMessages.length > 0 && !isHuddling && (
                <button
                  onClick={handleSynthesizeProposal}
                  className="btn-primary text-xs py-1.5 px-3"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Proposal
                </button>
              )}
            </div>
          </div>

          {/* Stepper Status Banner if Active */}
          {activeFlowStep && (
            <div className="bg-purple-950/40 border-b border-purple-500/30 px-4 py-2 text-xs text-purple-200 flex items-center justify-between font-mono animate-pulse">
              <span className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> {activeFlowStep}
              </span>
              <span className="text-[10px] text-cyan-400">Processing Feasibility</span>
            </div>
          )}

          {/* Teams / WhatsApp Style Chat Window with Right/Left Alignment */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto max-h-[500px] space-y-4">
            {currentChannelMessages.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-2xl">
                  💬
                </div>
                <h4 className="text-sm font-medium text-slate-300">Welcome to #{activeChannel.name}</h4>
                <p className="text-xs max-w-sm mt-1">
                  Start the conversation below. CEO messages appear on the right; Crew responses appear on the left!
                </p>
              </div>
            ) : (
              currentChannelMessages.map((msg) => {
                const isCEO = msg.agentRole === 'CEO';

                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${isCEO ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    {/* Header line */}
                    <div className={`flex items-center gap-2 text-xs text-slate-400 px-1 ${isCEO ? 'flex-row-reverse' : ''}`}>
                      <span className="font-semibold text-slate-300">{msg.agentName}</span>
                      <span className={`badge ${msg.badgeClass} text-[9px] px-1.5 py-0.2`}>{msg.agentRole}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{formatTimestamp(msg.timestamp)}</span>
                    </div>

                    {/* Chat Bubble */}
                    <div className={`max-w-[85%] lg:max-w-[80%] rounded-2xl p-4 space-y-3 shadow-lg transition-all ${
                      isCEO
                        ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-tr-none border border-purple-400/30'
                        : msg.isClarificationRequest
                        ? 'bg-sky-950/90 border border-sky-500/50 text-sky-100 rounded-tl-none'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-100 rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {msg.content}
                      </p>

                      {/* Company Feasibility & Prerequisites Card */}
                      {msg.companyFeasibility && (
                        <div className="p-3 bg-slate-950/80 rounded-xl border border-sky-500/40 text-xs space-y-2 text-left">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                            <span className="font-bold text-sky-300 flex items-center gap-1.5">
                              <Cpu className="w-4 h-4 text-sky-400" /> Company Prerequisites & Feasibility Analysis
                            </span>
                            <span className="badge badge-cso text-[9px]">Aria Vance BA Audit</span>
                          </div>

                          <div className="space-y-1.5">
                            {msg.companyFeasibility.prerequisites.map((p, pIdx) => (
                              <div key={pIdx} className="flex items-start justify-between text-[11px] bg-slate-900/60 p-2 rounded border border-slate-800">
                                <div>
                                  <span className="font-semibold text-slate-200">{p.category}: </span>
                                  <span className="text-slate-400">{p.detail}</span>
                                </div>
                                {p.alert ? (
                                  <span className="badge badge-cmo text-[9px] flex items-center gap-1 shrink-0">
                                    <UserPlus className="w-3 h-3" /> HIRE CONTRACTOR
                                  </span>
                                ) : (
                                  <span className="badge badge-cfo text-[9px] shrink-0">READY</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Aria Vance (Lead BA) Agile Sprints Accordion */}
                      {msg.agileSprints && msg.agileSprints.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-white/10 space-y-2">
                          <button
                            type="button"
                            onClick={() => toggleSprintsExpand(msg.id)}
                            className="flex items-center justify-between w-full text-xs font-semibold text-purple-300 bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800 hover:border-purple-500/40 transition-all"
                          >
                            <span className="flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-purple-400" />
                              Aria Vance (Lead BA) Agile Sprint Breakdown ({msg.agileSprints.length} Sprints)
                            </span>
                            {expandedSprintsId === msg.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          {expandedSprintsId === msg.id && (
                            <div className="p-3 bg-slate-950/90 rounded-xl border border-purple-500/30 space-y-4 text-xs text-left animate-fadeIn">
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                                <span>Agile Sprint Breakdown & Iterative QA Rework</span>
                                <span className="text-purple-400 font-mono text-[10px]">Lead BA Management</span>
                              </div>

                              <div className="space-y-3">
                                {msg.agileSprints.map((sprint, sIdx) => (
                                  <div key={sIdx} className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-2">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                                      <h5 className="font-bold text-purple-300 text-xs flex items-center gap-1.5">
                                        <Layers className="w-3.5 h-3.5 text-purple-400" /> {sprint.sprintName}
                                      </h5>
                                      <span className="text-[10px] text-slate-400 font-mono">Duration: {sprint.duration}</span>
                                    </div>

                                    <div className="space-y-2">
                                      {sprint.subTasks.map((st) => (
                                        <div key={st.id} className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 space-y-1.5">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              <span className={`badge ${st.badgeClass} text-[10px]`}>{st.assigneeRole}</span>
                                              <span className="font-semibold text-white text-xs">{st.title}</span>
                                            </div>

                                            {st.status === 'COMPLETED' ? (
                                              <span className="badge badge-cfo text-[10px] flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> QA PASSED (Iter #{st.qaIterationCount || 1})
                                              </span>
                                            ) : (
                                              <span className="badge badge-cmo text-[10px] flex items-center gap-1 animate-pulse">
                                                <AlertCircle className="w-3 h-3" /> QA REJECTED (Iter #{st.qaIterationCount || 1})
                                              </span>
                                            )}
                                          </div>

                                          <p className="text-[11px] text-slate-300 italic font-mono">"{st.userStory}"</p>

                                          {/* QA Audit Feedback */}
                                          {st.qaAudit && (
                                            <div className={`p-2 rounded border text-[11px] ${
                                              st.qaAudit.passed 
                                                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                                                : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                                            }`}>
                                              <div className="font-bold flex items-center justify-between">
                                                <span>Audited by {st.qaAudit.auditedBy}</span>
                                                {st.qaAudit.auditedAt && <span className="text-[9px] opacity-75 font-mono">{formatTimestamp(st.qaAudit.auditedAt)}</span>}
                                              </div>
                                              <p className="mt-0.5">{st.qaAudit.feedback}</p>

                                              {!st.qaAudit.passed && (
                                                <button
                                                  onClick={() => handleIterativeQARework(msg.id, sIdx, st.id)}
                                                  className="mt-2 btn-secondary text-[10px] py-1 px-2.5 text-emerald-300 border-emerald-500/30 hover:bg-emerald-950/40 flex items-center gap-1"
                                                >
                                                  <RefreshCw className="w-3 h-3" /> Re-Submit for QA Audit (Iter #{ (st.qaIterationCount || 1) + 1 })
                                                </button>
                                              )}
                                            </div>
                                          )}

                                          {/* GitHub Push Action */}
                                          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px]">
                                            <span className="text-slate-500 font-mono">Assignee: {st.assigneeName}</span>
                                            
                                            {st.githubIssueUrl ? (
                                              <a
                                                href={st.githubIssueUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-cyan-400 hover:underline font-mono flex items-center gap-1"
                                              >
                                                <GitPullRequest className="w-3 h-3" /> View GitHub Issue
                                              </a>
                                            ) : (
                                              <button
                                                onClick={() => handlePushSubTaskToGitHub(st.id, st)}
                                                disabled={ghSyncStatus[st.id] === 'syncing'}
                                                className="text-purple-300 hover:text-purple-200 font-mono flex items-center gap-1 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/30"
                                              >
                                                <GitPullRequest className="w-3 h-3" /> 
                                                {ghSyncStatus[st.id] === 'syncing' ? 'Syncing...' : 'Log on GitHub Projects'}
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Internal Sub-Chat Drawer */}
                      {msg.internalSubChatLog && msg.internalSubChatLog.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => toggleSubChatExpand(msg.id)}
                            className="flex items-center justify-between w-full text-xs font-semibold text-cyan-300 bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800 hover:border-cyan-500/40 transition-all"
                          >
                            <span className="flex items-center gap-1.5">
                              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                              Inspect Internal Thinking Sub-Chat ({msg.internalSubChatLog.length} Sub-Messages)
                            </span>
                            {expandedSubChatId === msg.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          {expandedSubChatId === msg.id && (
                            <div className="mt-2 p-3 bg-slate-950/90 rounded-xl border border-cyan-500/30 space-y-2 text-xs text-left animate-fadeIn">
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                                <span>Specialist Consultation Transcript</span>
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
                  </div>
                );
              })
            )}
          </div>

          {/* Teams Style Interactive Message Input Bar */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/60 space-y-2.5">
            
            {/* Quick @Tag Pills */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-400">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <AtSign className="w-3 h-3 text-purple-400" /> Tag Member:
              </span>
              {crewRoster.filter(a => activeChannel.members.includes(a.role) && a.role !== 'CEO').map(agent => (
                <button
                  key={agent.role}
                  type="button"
                  onClick={() => handleTagAgentInput(agent.role)}
                  className="px-2 py-0.5 rounded-md bg-slate-950 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/40 text-[11px] font-mono text-purple-300 transition-all flex items-center gap-1"
                >
                  <span>{agent.avatar}</span> @{agent.role}
                </button>
              ))}
            </div>

            <form onSubmit={handleSendCEOMessage} className="flex items-center gap-2 bg-slate-950/90 border border-slate-700/80 rounded-xl p-2 focus-within:border-purple-500 transition-all">
              <input
                type="text"
                value={userChatInput}
                onChange={(e) => setUserChatInput(e.target.value)}
                placeholder={`Message #${activeChannel.name} or assign initiative (e.g. build architecture for website)...`}
                className="flex-1 bg-transparent text-xs py-1.5 px-2 text-white placeholder-slate-500 focus:outline-none"
                disabled={isHuddling}
              />

              <div className="flex items-center gap-1 text-slate-500 px-1">
                <Paperclip className="w-4 h-4 cursor-pointer hover:text-slate-300" title="Attach file" />
                <Mic className="w-4 h-4 cursor-pointer hover:text-slate-300" title="Voice note" />
              </div>

              <button
                type="submit"
                disabled={!userChatInput.trim() || isHuddling}
                className="btn-primary text-xs py-2 px-3.5 disabled:opacity-50 flex items-center gap-1 shadow-md"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Modal: Create Custom Group Channel */}
      {isCreateChannelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel p-6 max-w-md w-full border-purple-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" /> Create Custom Group / Channel
              </h3>
              <button 
                onClick={() => setIsCreateChannelOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateChannelSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Channel Name</label>
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="e.g. website-architecture or sprint-review"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Description (Optional)</label>
                <input
                  type="text"
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                  placeholder="e.g. Dedicated channel for BA Sprint Planning & Dev Execution"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Assign Group Members</label>
                <div className="grid grid-cols-2 gap-2">
                  {crewRoster.filter(a => a.role !== 'CEO').map(agent => {
                    const isSelected = selectedChannelMembers.includes(agent.role);
                    return (
                      <div
                        key={agent.role}
                        onClick={() => toggleMemberSelection(agent.role)}
                        className={`p-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-purple-950/80 border-purple-500 text-white'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{agent.avatar}</span> {agent.name}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateChannelOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
