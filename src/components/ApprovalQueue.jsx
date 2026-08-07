import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  DollarSign, 
  ShieldAlert, 
  Layers, 
  UserCheck, 
  ChevronRight,
  Clock
} from 'lucide-react';

export default function ApprovalQueue({ proposals, onApprove, onReject, onRequestRevision }) {
  const [selectedProposalId, setSelectedProposalId] = useState(proposals[0]?.id || null);
  const [feedbackNote, setFeedbackNote] = useState('');

  const selectedProposal = proposals.find(p => p.id === selectedProposalId) || proposals[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
              <UserCheck className="w-3.5 h-3.5" /> CEO Governance Gateway
            </div>
            <h2 className="text-2xl font-bold text-white">Pending Executive Directives</h2>
            <p className="text-sm text-slate-400 mt-1">
              As CEO, review proposals submitted by your C-Suite crew. Nothing executes until you explicitly sign off.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-white">
              {proposals.filter(p => p.status === 'PENDING_APPROVAL').length} Pending CEO Review
            </span>
          </div>
        </div>
      </div>

      {proposals.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-500">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-3xl">
            👑
          </div>
          <h3 className="text-lg font-semibold text-slate-200">No Proposals in Queue</h3>
          <p className="text-sm mt-1 max-w-md mx-auto">
            Head to the <strong>Boardroom Huddle</strong> tab and convene your executive crew to generate strategic directives for CEO sign-off.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left List of Proposals */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Proposal Inbox
            </h3>
            <div className="space-y-2">
              {proposals.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => setSelectedProposalId(prop.id)}
                  className={`glass-card p-4 cursor-pointer transition-all border-l-4 ${
                    selectedProposalId === prop.id
                      ? 'border-l-purple-500 bg-purple-950/30 border-slate-700'
                      : prop.status === 'APPROVED'
                      ? 'border-l-emerald-500 opacity-80'
                      : prop.status === 'REJECTED'
                      ? 'border-l-rose-500 opacity-70'
                      : 'border-l-amber-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-slate-400">{prop.proposer}</span>
                    <span className={`badge ${
                      prop.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                      prop.status === 'REJECTED' ? 'bg-rose-950 text-rose-400 border-rose-800' :
                      'bg-amber-950 text-amber-400 border-amber-800'
                    }`}>
                      {prop.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white line-clamp-1">{prop.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{prop.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Detail Pane */}
          {selectedProposal && (
            <div className="lg:col-span-8">
              <div className="glass-panel p-6 space-y-6">
                
                {/* Title & Proposer Header */}
                <div className="border-b border-slate-800 pb-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="badge badge-cso mb-2">{selectedProposal.category}</span>
                      <h3 className="text-xl font-bold text-white">{selectedProposal.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Submitted by <strong className="text-slate-200">{selectedProposal.proposer}</strong> on {new Date(selectedProposal.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Executive Summary
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    {selectedProposal.summary}
                  </p>
                </div>

                {/* Financial & Risk Assessment Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Financial Impact */}
                  <div className="glass-card p-4 space-y-2 border-emerald-500/20 bg-emerald-950/10">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <DollarSign className="w-4 h-4" /> Financial Projections
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Capital Required:</span>
                        <span className="font-semibold text-white">{selectedProposal.financialImpact.budgetRequired}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Est. Monthly Revenue:</span>
                        <span className="font-semibold text-emerald-400">{selectedProposal.financialImpact.estimatedRevenue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Payback Window:</span>
                        <span className="font-semibold text-white">{selectedProposal.financialImpact.paybackPeriod}</span>
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="glass-card p-4 space-y-2 border-cyan-500/20 bg-cyan-950/10">
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                      <ShieldAlert className="w-4 h-4" /> Risk & Feasibility Audit
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedProposal.riskAssessment}
                    </p>
                  </div>

                </div>

                {/* Key Deliverables */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Target Deliverables
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedProposal.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 bg-slate-900/40 px-3 py-2 rounded-lg border border-slate-800/80">
                        <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Agent Reviews */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    C-Suite Crew Reviews
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {selectedProposal.agentReviews.map((rev, idx) => (
                      <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-bold text-purple-400">{rev.role} Audit:</span>
                        <p className="text-xs text-slate-300 mt-0.5">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CEO Action Bar */}
                {selectedProposal.status === 'PENDING_APPROVAL' && (
                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <input
                      type="text"
                      value={feedbackNote}
                      onChange={(e) => setFeedbackNote(e.target.value)}
                      placeholder="Optional CEO directive or notes for the crew..."
                      className="w-full text-xs"
                    />

                    <div className="flex flex-wrap items-center justify-end gap-3">
                      <button
                        onClick={() => onReject(selectedProposal.id, feedbackNote)}
                        className="btn-reject text-xs"
                      >
                        <XCircle className="w-4 h-4" /> Reject Proposal
                      </button>

                      <button
                        onClick={() => onRequestRevision(selectedProposal.id, feedbackNote)}
                        className="btn-secondary text-xs"
                      >
                        <RotateCcw className="w-4 h-4" /> Request Revision
                      </button>

                      <button
                        onClick={() => onApprove(selectedProposal.id, feedbackNote)}
                        className="btn-approve text-sm shadow-lg shadow-emerald-600/30"
                      >
                        <CheckCircle2 className="w-4 h-4" /> CEO Approve & Dispatch Crew
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
