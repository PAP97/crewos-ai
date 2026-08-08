/**
 * Per-Agent Vector Brain Memory Service for CrewOS
 * Maintains isolated Vector Memory Vaults for each C-suite agent role (CEO, COO, CSO, CTO, CMO, CFO, DEV, PLANNER).
 */

const STORAGE_BRAINS_KEY = 'crewos_agent_brains';

const INITIAL_AGENT_BRAINS = {
  COO: {
    agentRole: 'COO',
    agentName: 'Orion Vance',
    title: 'Chief Operations Officer & CEO Liaison',
    memories: [
      {
        id: 'coo-mem-1',
        title: 'Cross-Functional Operational Synchronization',
        content: 'Systematic alignment between CEO vision and cross-departmental execution reduces operational friction by 68%. Always clarify ambiguous goals before dispatching to strategy, tech, or finance.',
        tags: ['Operations', 'Alignment', 'Liaison Protocol'],
        vectorWeight: 0.96,
        timestamp: '2026-08-07T11:00:00Z'
      },
      {
        id: 'coo-mem-2',
        title: 'Closed-Loop QA & Sub-Task Audit Guidelines',
        content: 'Every sub-task must satisfy production standards before approval. If quality fails or requirements are missing, immediately re-assign to the specialist with specific rework instructions.',
        tags: ['QA Audit', 'Quality Control', 'Re-assignment'],
        vectorWeight: 0.94,
        timestamp: '2026-08-07T11:30:00Z'
      },
      {
        id: 'coo-mem-3',
        title: 'Multi-Perspective Business Systems Architecture',
        content: 'Successful operational scaling requires balancing strategy (CSO), technical robustness (CTO), financial capital efficiency (CFO), and brand narrative (CMO).',
        tags: ['Systems Thinking', 'Multi-Perspective', 'Strategy'],
        vectorWeight: 0.92,
        timestamp: '2026-08-07T12:00:00Z'
      }
    ]
  },
  CSO: {
    agentRole: 'CSO',
    agentName: 'Aria Vance',
    title: 'Chief Strategy Officer & Quality Director',
    memories: [
      {
        id: 'cso-mem-1',
        title: 'Defensible Market Moat Strategy',
        content: 'Focus product positioning on zero-latency client state combined with GitHub REST API persistence to build high user retention.',
        tags: ['Strategy', 'Positioning', 'Moat'],
        vectorWeight: 0.95,
        timestamp: '2026-08-07T10:00:00Z'
      },
      {
        id: 'cso-mem-2',
        title: 'Sub-Task Work Breakdown Methodology',
        content: 'Deconstruct executive initiatives into 4 discrete sub-tasks: Architecture (CTO), Financial Audit (CFO), GTM (CMO), and Code Sprint (DEV).',
        tags: ['Work Breakdown', 'Sub-Tasks', 'Bifurcation'],
        vectorWeight: 0.91,
        timestamp: '2026-08-07T10:15:00Z'
      }
    ]
  },
  CTO: {
    agentRole: 'CTO',
    agentName: 'Marcus Sterling',
    title: 'Chief Technology Officer',
    memories: [
      {
        id: 'cto-mem-1',
        title: 'Zero-Backend Vite + React Architecture',
        content: 'Client-side state architecture with GitHub REST API integration provides instant zero-latency UI rendering and free 100% uptime hosting on GitHub Pages.',
        tags: ['Architecture', 'React', 'GitHub API'],
        vectorWeight: 0.98,
        timestamp: '2026-08-07T10:00:00Z'
      },
      {
        id: 'cto-mem-2',
        title: 'Vector Similarity Memory Search',
        content: 'Cosine-sim keyword matching over in-memory JSON data structures provides instantaneous RAG retrieval without external vector DB costs.',
        tags: ['Vector RAG', 'In-Memory DB', 'Performance'],
        vectorWeight: 0.89,
        timestamp: '2026-08-07T10:20:00Z'
      }
    ]
  },
  CMO: {
    agentRole: 'CMO',
    agentName: 'Elena Rostova',
    title: 'Chief Marketing Officer',
    memories: [
      {
        id: 'cmo-mem-1',
        title: 'CEO Governance Storytelling & GTM',
        content: 'Position CrewOS as the premier "CEO AI Command Deck" where founders control an autonomous C-suite. Highlight 1-click GitHub approvals.',
        tags: ['GTM', 'Storytelling', 'Positioning'],
        vectorWeight: 0.94,
        timestamp: '2026-08-07T10:00:00Z'
      }
    ]
  },
  CFO: {
    agentRole: 'CFO',
    agentName: 'Dominic Croft',
    title: 'Chief Financial Officer',
    memories: [
      {
        id: 'cfo-mem-1',
        title: 'Gross Margin & Capital Efficiency Rules',
        content: 'Serverless client-side architecture keeps operating expenditure near $0. Aim for >85% gross margins on subscription tiers with <60 day payback.',
        tags: ['Finance', 'Gross Margin', 'Unit Economics'],
        vectorWeight: 0.97,
        timestamp: '2026-08-07T10:00:00Z'
      }
    ]
  },
  DEV: {
    agentRole: 'DEV',
    agentName: 'Devin Cole',
    title: 'Lead Systems Developer',
    memories: [
      {
        id: 'dev-mem-1',
        title: 'Modular React Component Contracts',
        content: 'Keep state cleanly isolated inside custom hooks or service modules. Validate prop types and maintain responsive Tailwind styling.',
        tags: ['Development', 'React', 'Tailwind'],
        vectorWeight: 0.93,
        timestamp: '2026-08-07T10:00:00Z'
      }
    ]
  }
};

/**
 * Gets or initializes the per-agent vector memory brains
 */
export const getAgentBrainStore = () => {
  try {
    const saved = localStorage.getItem(STORAGE_BRAINS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load agent brains from storage:', e);
  }
  return INITIAL_AGENT_BRAINS;
};

/**
 * Gets memories for a specific Agent Brain
 */
export const getAgentBrainMemories = (agentRole) => {
  const store = getAgentBrainStore();
  const brain = store[agentRole];
  return brain ? brain.memories || [] : [];
};

/**
 * Persists updated agent brain store
 */
export const saveAgentBrainStore = (brainStore) => {
  localStorage.setItem(STORAGE_BRAINS_KEY, JSON.stringify(brainStore));
};

/**
 * Queries a specific Agent's Vector Memory Brain
 */
export const queryAgentBrainVector = (agentRole, queryText, topK = 3) => {
  const store = getAgentBrainStore();
  const brain = store[agentRole];
  if (!brain || !brain.memories || brain.memories.length === 0) {
    return `No vector memories logged for ${agentRole}.`;
  }

  const queryTerms = queryText.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  
  const scored = brain.memories.map(mem => {
    const textToSearch = `${mem.title} ${mem.content} ${(mem.tags || []).join(' ')}`.toLowerCase();
    let matchCount = 0;
    queryTerms.forEach(term => {
      if (textToSearch.includes(term)) matchCount += 1;
    });

    const score = (matchCount / (queryTerms.length || 1)) * (mem.vectorWeight || 1.0);
    return { ...mem, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const topHits = scored.slice(0, topK);

  return topHits
    .map(h => `• [Score: ${(h.score * 100).toFixed(0)}%] ${h.title}: ${h.content}`)
    .join('\n');
};

/**
 * Adds a new vector memory item to a specific Agent's Brain
 */
export const addAgentBrainMemory = (agentRole, title, content, tags = [], weight = 0.90) => {
  const store = getAgentBrainStore();
  if (!store[agentRole]) {
    store[agentRole] = {
      agentRole,
      agentName: `${agentRole} Specialist`,
      title: `${agentRole} Domain Brain`,
      memories: []
    };
  }

  const newMem = {
    id: `${agentRole.toLowerCase()}-mem-${Date.now()}`,
    title,
    content,
    tags,
    vectorWeight: weight,
    timestamp: new Date().toISOString()
  };

  store[agentRole].memories.unshift(newMem);
  saveAgentBrainStore(store);
  return newMem;
};
