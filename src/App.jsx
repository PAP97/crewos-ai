import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Boardroom from './components/Boardroom';
import ApprovalQueue from './components/ApprovalQueue';
import MemoryVault from './components/MemoryVault';
import ExecutionBoard from './components/ExecutionBoard';
import CrewRoster from './components/CrewRoster';
import GitHubSettingsModal from './components/GitHubSettingsModal';
import ApiKeyModal from './components/ApiKeyModal';

import { DEFAULT_CREW_ROSTER, INITIAL_PROPOSALS } from './types/crew';
import { getMemories, addMemory } from './services/memoryService';
import { loadGitHubConfig } from './services/githubService';

export default function App() {
  const [activeTab, setActiveTab] = useState('BOARDROOM');
  const [crewRoster, setCrewRoster] = useState(DEFAULT_CREW_ROSTER);
  const [memories, setMemories] = useState([]);
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [executionTasks, setExecutionTasks] = useState([
    {
      id: 'task-1',
      proposalId: 'prop-101',
      proposalTitle: 'Enterprise AI Crew Command Suite (v1.0)',
      assigneeName: 'Devin Cole',
      assigneeRole: 'DEV',
      badgeClass: 'badge-dev',
      title: 'Vite React Architecture & Shared Memory Hooks',
      filename: 'src/services/memoryService.js',
      codeContent: `// Crew Shared Memory Hook Engine\nexport const useCrewMemory = () => {\n  // Syncs memories across localStorage and GitHub\n  return { memories, addMemory, syncToGitHub };\n};`,
      description: 'Built high-throughput memory indexing with local storage persistence and GitHub REST sync.'
    },
    {
      id: 'task-2',
      proposalId: 'prop-101',
      proposalTitle: 'Enterprise AI Crew Command Suite (v1.0)',
      assigneeName: 'Elena Rostova',
      assigneeRole: 'CMO',
      badgeClass: 'badge-cmo',
      title: 'GTM Positioning & Product Launch Strategy',
      codeContent: null,
      description: 'Positioning: "Command an Autonomous C-Suite Crew with Complete CEO Governance". Launch vectors: ProductHunt, X (Twitter) thread series, & GitHub Pages live demo.'
    }
  ]);

  const [gitHubConfig, setGitHubConfig] = useState({ token: '', repo: '', branch: 'main', autoSync: false });
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);

  // Load state on mount
  useEffect(() => {
    setMemories(getMemories());
    setGitHubConfig(loadGitHubConfig());
  }, []);

  const showToast = (message, type = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Handler: When a new proposal is created from Boardroom
  const handleProposalGenerated = (newProposal) => {
    setProposals(prev => [newProposal, ...prev]);
    setActiveTab('APPROVALS');
    showToast(`New directive "${newProposal.title}" submitted for CEO Approval!`, 'info');
  };

  // Handler: CEO Approve Proposal
  const handleApproveProposal = (proposalId, feedback) => {
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'APPROVED', ceoFeedback: feedback } : p));
    
    const prop = proposals.find(p => p.id === proposalId);
    if (!prop) return;

    // Automatically create Execution Tasks for Dev, CTO, CMO
    const newTasks = [
      {
        id: `task-${Date.now()}-dev`,
        proposalId: prop.id,
        proposalTitle: prop.title,
        assigneeName: 'Devin Cole',
        assigneeRole: 'DEV',
        badgeClass: 'badge-dev',
        title: `Code Implementation: ${prop.title}`,
        filename: `src/features/${prop.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.js`,
        codeContent: `/**\n * Approved CEO Directive Implementation\n * Proposal: ${prop.title}\n * Authorized by: CEO (User)\n */\nexport const executeDirective = () => {\n  console.log("Executing approved directive with crew alignment...");\n  return { success: true, timestamp: "${new Date().toISOString()}" };\n};`,
        description: `Generated production implementation code for ${prop.title}`
      },
      {
        id: `task-${Date.now()}-cmo`,
        proposalId: prop.id,
        proposalTitle: prop.title,
        assigneeName: 'Elena Rostova',
        assigneeRole: 'CMO',
        badgeClass: 'badge-cmo',
        title: `GTM Campaign & Launch Strategy`,
        codeContent: null,
        description: `Multi-channel launch campaign ready for ${prop.title}. Target audience notified.`
      }
    ];

    setExecutionTasks(prev => [...newTasks, ...prev]);

    // Record CEO approval in shared memory
    const memory = addMemory({
      authorId: 'agent-ceo',
      authorName: 'CEO (User)',
      authorRole: 'CEO',
      category: 'CEO Decision',
      title: `APPROVED: ${prop.title}`,
      content: `CEO officially signed off on "${prop.title}". Budget authorized. Execution tasks dispatched to Lead Dev & CMO. Feedback: "${feedback || 'Proceed with excellence.'}"`,
      tags: ['CEO Approval', 'Mandate', prop.category],
      importance: 'High'
    });

    setMemories(prev => [memory, ...prev]);
    showToast(`Proposal Approved! Execution tasks dispatched to Crew.`, 'success');
  };

  // Handler: CEO Reject Proposal
  const handleRejectProposal = (proposalId, feedback) => {
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'REJECTED', ceoFeedback: feedback } : p));
    showToast('Proposal rejected by CEO.', 'warning');
  };

  // Handler: CEO Request Revision
  const handleRequestRevision = (proposalId, feedback) => {
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'REVISION_REQUESTED', ceoFeedback: feedback } : p));
    showToast('Revision requested. Crew will adjust strategy in Boardroom.', 'info');
  };

  const isGitHubConnected = Boolean(gitHubConfig.token && gitHubConfig.repo);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* Top Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingApprovalsCount={proposals.filter(p => p.status === 'PENDING_APPROVAL').length}
        memoryCount={memories.length}
        isGitHubConnected={isGitHubConnected}
        onOpenGitHubSettings={() => setIsGitHubModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        
        {/* Toast Alert */}
        {toastNotification && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce">
            <div className="glass-panel px-5 py-3 border-purple-500/40 text-xs font-semibold text-white shadow-2xl flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
              {toastNotification.message}
            </div>
          </div>
        )}

        {/* Tab Router */}
        {activeTab === 'BOARDROOM' && (
          <Boardroom
            crewRoster={crewRoster}
            onProposalGenerated={handleProposalGenerated}
          />
        )}

        {activeTab === 'APPROVALS' && (
          <ApprovalQueue
            proposals={proposals}
            onApprove={handleApproveProposal}
            onReject={handleRejectProposal}
            onRequestRevision={handleRequestRevision}
          />
        )}

        {activeTab === 'MEMORY' && (
          <MemoryVault
            memories={memories}
            setMemories={setMemories}
            gitHubConfig={gitHubConfig}
            onOpenGitHubSettings={() => setIsGitHubModalOpen(true)}
          />
        )}

        {activeTab === 'EXECUTION' && (
          <ExecutionBoard
            tasks={executionTasks}
            gitHubConfig={gitHubConfig}
            onOpenGitHubSettings={() => setIsGitHubModalOpen(true)}
          />
        )}

        {activeTab === 'ROSTER' && (
          <CrewRoster
            crewRoster={crewRoster}
            setCrewRoster={setCrewRoster}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>CrewOS AI &copy; {new Date().getFullYear()} — Autonomous Executive Crew Platform with CEO Governance & GitHub Memory Sync</p>
      </footer>

      {/* GitHub Settings Modal */}
      {isGitHubModalOpen && (
        <GitHubSettingsModal
          config={gitHubConfig}
          setConfig={setGitHubConfig}
          onClose={() => setIsGitHubModalOpen(false)}
        />
      )}

      {/* AI Key Config Modal */}
      {isApiKeyModalOpen && (
        <ApiKeyModal
          onClose={() => setIsApiKeyModalOpen(false)}
        />
      )}

    </div>
  );
}
