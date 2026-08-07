import { INITIAL_MEMORIES } from '../types/crew';
import { loadGitHubConfig, syncMemoryToGitHub } from './githubService';

const STORAGE_KEY = 'crewos_shared_memory';

export const getMemories = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_MEMORIES;
  } catch (e) {
    return INITIAL_MEMORIES;
  }
};

export const saveMemories = (memories) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));

  // Trigger optional background GitHub Sync if configured
  const ghConfig = loadGitHubConfig();
  if (ghConfig.token && ghConfig.repo && ghConfig.autoSync) {
    syncMemoryToGitHub(ghConfig, memories).catch(err => {
      console.warn('Auto-sync memory to GitHub failed:', err);
    });
  }
};

export const addMemory = (newMemory) => {
  const current = getMemories();
  const memoryObj = {
    id: `mem-${Date.now()}`,
    timestamp: new Date().toISOString(),
    importance: 'Medium',
    tags: ['Learned Principle'],
    ...newMemory
  };
  const updated = [memoryObj, ...current];
  saveMemories(updated);
  return memoryObj;
};

export const searchMemories = (query, categoryFilter = 'ALL') => {
  const memories = getMemories();
  return memories.filter(mem => {
    const matchesCategory = categoryFilter === 'ALL' || mem.category === categoryFilter;
    const q = query.toLowerCase();
    const matchesQuery = !query || 
      mem.title.toLowerCase().includes(q) ||
      mem.content.toLowerCase().includes(q) ||
      mem.tags.some(t => t.toLowerCase().includes(q)) ||
      mem.authorName.toLowerCase().includes(q);
    
    return matchesCategory && matchesQuery;
  });
};

/**
 * Retrieves relevant crew context to inject into AI prompt context window
 */
export const getRelevantMemoryContext = (topic) => {
  const memories = getMemories();
  if (!memories.length) return 'No prior memory logged.';

  // Select top memories or recent high-importance ones
  const topMemories = memories
    .slice(0, 5)
    .map(m => `[${m.category.toUpperCase()}] ${m.authorRole} (${m.title}): ${m.content}`)
    .join('\n');

  return topMemories;
};
