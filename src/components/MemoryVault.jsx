import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Plus, 
  Github, 
  Tag, 
  Clock, 
  BrainCircuit, 
  Download, 
  Upload,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { searchMemories, addMemory } from '../services/memoryService';
import { syncMemoryToGitHub } from '../services/githubService';

export default function MemoryVault({ memories, setMemories, gitHubConfig, onOpenGitHubSettings }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  // New Memory Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Strategy Directive');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('CEO Mandate, Strategy');

  const filteredMemories = searchMemories(searchQuery, categoryFilter);

  const handleAddMemorySubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const memory = addMemory({
      authorId: 'agent-ceo',
      authorName: 'CEO (User)',
      authorRole: 'CEO',
      category: newCategory,
      title: newTitle,
      content: newContent,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      importance: 'High'
    });

    setMemories(prev => [memory, ...prev]);
    setIsAddingModalOpen(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleSyncToGitHubNow = async () => {
    if (!gitHubConfig.token || !gitHubConfig.repo) {
      onOpenGitHubSettings();
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await syncMemoryToGitHub(gitHubConfig, memories);
      setSyncStatus({ success: true, message: `Memory synced to GitHub repository (${gitHubConfig.repo})` });
    } catch (err) {
      setSyncStatus({ success: false, message: err.message || 'GitHub sync failed' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(memories, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `crewos_memory_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="glass-panel p-6 border-cyan-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              <BrainCircuit className="w-3.5 h-3.5" /> Collective Crew Intelligence
            </div>
            <h2 className="text-2xl font-bold text-white">Shared Memory Vault</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Every boardroom huddle, CEO approval, and strategic directive is indexed here. All crew members query this memory bank before proposing plans so they never forget context.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddingModalOpen(true)}
              className="btn-primary text-xs"
            >
              <Plus className="w-4 h-4" /> Add Memory Entry
            </button>

            <button
              onClick={handleSyncToGitHubNow}
              disabled={isSyncing}
              className="btn-secondary text-xs"
            >
              <Github className="w-4 h-4 text-cyan-400" />
              {isSyncing ? 'Syncing to GitHub...' : 'Sync to GitHub'}
            </button>

            <button
              onClick={handleExportJSON}
              className="btn-secondary text-xs"
              title="Export memories as JSON file"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* Sync Status Alert */}
        {syncStatus && (
          <div className={`mt-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
            syncStatus.success ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {syncStatus.message}
          </div>
        )}

        {/* Search & Category Filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memories by keyword, tag, or author..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900 border border-slate-700/80 rounded-xl"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 text-xs rounded-xl px-3 py-2.5"
          >
            <option value="ALL">All Categories</option>
            <option value="Vision & Charter">Vision & Charter</option>
            <option value="Boardroom Decision">Boardroom Decisions</option>
            <option value="Market Intelligence">Market Intelligence</option>
            <option value="Technical Architecture">Technical Architecture</option>
          </select>
        </div>
      </div>

      {/* Memory Grid Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMemories.length === 0 ? (
          <div className="col-span-2 glass-panel p-12 text-center text-slate-500">
            <Database className="w-12 h-12 stroke-1 mx-auto mb-3 text-slate-600" />
            <p className="text-sm">No memories found matching your search query.</p>
          </div>
        ) : (
          filteredMemories.map((mem) => (
            <div key={mem.id} className="glass-card p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">{mem.category}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                  <Clock className="w-3 h-3" />
                  {new Date(mem.timestamp).toLocaleDateString()}
                </div>
              </div>

              <h3 className="text-base font-bold text-white">{mem.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                {mem.content}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {mem.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700 flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5 text-slate-400" />
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  By <strong className="text-slate-200">{mem.authorName}</strong> ({mem.authorRole})
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Memory Modal */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 space-y-4 border-purple-500/30">
            <h3 className="text-lg font-bold text-white">Add Knowledge Entry to Crew Memory</h3>
            <form onSubmit={handleAddMemorySubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Memory Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Brand Tone Guidelines & Core Objectives"
                  className="w-full text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full text-xs"
                >
                  <option value="Vision & Charter">Vision & Charter</option>
                  <option value="Strategy Directive">Strategy Directive</option>
                  <option value="Technical Architecture">Technical Architecture</option>
                  <option value="Brand & Marketing">Brand & Marketing</option>
                  <option value="Financial Rule">Financial Rule</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Knowledge Content</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Detail the rule, guideline, tech requirement, or lesson learned..."
                  className="w-full text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="CEO Mandate, Strategy, v1.0"
                  className="w-full text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Save to Shared Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
