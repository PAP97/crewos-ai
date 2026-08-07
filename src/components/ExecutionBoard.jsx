import React, { useState } from 'react';
import { Layers, Code2, FileText, CheckCircle, Terminal, Copy, Check, Github, ExternalLink, Ticket, Sparkles } from 'lucide-react';
import { createGitHubIssue } from '../services/githubService';

export default function ExecutionBoard({ tasks, gitHubConfig, onOpenGitHubSettings }) {
  const [copiedId, setCopiedId] = useState(null);
  const [ticketStatusMap, setTicketStatusMap] = useState({});

  const handleCopyCode = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateGitHubTicket = async (task) => {
    if (!gitHubConfig.token || !gitHubConfig.repo) {
      onOpenGitHubSettings();
      return;
    }

    setTicketStatusMap(prev => ({ ...prev, [task.id]: { loading: true } }));

    try {
      const result = await createGitHubIssue(gitHubConfig, task);
      setTicketStatusMap(prev => ({
        ...prev,
        [task.id]: { loading: false, success: true, url: result.issueUrl, number: result.issueNumber }
      }));
    } catch (err) {
      setTicketStatusMap(prev => ({
        ...prev,
        [task.id]: { loading: false, error: err.message || 'Failed to create GitHub ticket' }
      }));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 border-amber-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" /> Approved Deliverables Pipeline
            </div>
            <h2 className="text-2xl font-bold text-white">Execution Board & GitHub Tickets</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Directives approved by the CEO dispatch tasks to crew members (Dev, CTO, CMO, CFO). Push any deliverable as a live ticket/issue to your GitHub repository!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-white">
              {tasks.length} Active Deliverables
            </div>
          </div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-500">
          <Terminal className="w-12 h-12 stroke-1 mx-auto mb-3 text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-300">No Active Tasks Executing</h3>
          <p className="text-xs mt-1">Approve a proposal in the <strong>CEO Approvals</strong> tab to dispatch crew execution tasks here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => {
            const ticketInfo = ticketStatusMap[task.id];

            return (
              <div key={task.id} className="glass-card p-6 space-y-4 border-slate-800 hover:border-purple-500/40">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${task.badgeClass}`}>{task.assigneeRole}</span>
                    <span className="text-xs font-mono text-slate-400">{task.assigneeName}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Completed
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{task.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Initiative: {task.proposalTitle}</p>
                </div>

                {/* Code or Text Artifact Block */}
                {task.codeContent ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1"><Code2 className="w-3.5 h-3.5 text-amber-400" /> {task.filename || 'generated_artifact.js'}</span>
                      <button
                        onClick={() => handleCopyCode(task.id, task.codeContent)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                      >
                        {copiedId === task.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedId === task.id ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                    <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 text-xs font-mono text-slate-200 overflow-x-auto max-h-52 leading-relaxed">
                      <code>{task.codeContent}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-2">
                    <div className="flex items-center gap-1 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <FileText className="w-3.5 h-3.5" /> Deliverable Summary
                    </div>
                    <p className="leading-relaxed">{task.description}</p>
                  </div>
                )}

                {/* GitHub Ticket Footer Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  {ticketInfo?.url ? (
                    <a
                      href={ticketInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 bg-purple-950/50 px-3 py-1.5 rounded-lg border border-purple-500/30"
                    >
                      <Github className="w-3.5 h-3.5" />
                      GitHub Issue #{ticketInfo.number} <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <button
                      onClick={() => handleCreateGitHubTicket(task)}
                      disabled={ticketInfo?.loading}
                      className="btn-secondary text-xs"
                    >
                      <Ticket className="w-3.5 h-3.5 text-purple-400" />
                      {ticketInfo?.loading ? 'Creating GitHub Ticket...' : 'Create GitHub Ticket'}
                    </button>
                  )}

                  {ticketInfo?.error && (
                    <span className="text-[11px] text-rose-400">{ticketInfo.error}</span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
