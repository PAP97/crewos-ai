/**
 * Per-Agent Vector Brain & Knowledge Service for CrewOS
 * Each crew member has a dedicated, isolated memory vault with vector metadata.
 */

const STORAGE_PREFIX = 'crewos_agent_brain_';

export const INITIAL_AGENT_BRAINS = {
  CSO: [
    {
      id: 'brain-cso-1',
      agentRole: 'CSO',
      timestamp: '2026-08-07T10:00:00Z',
      title: 'Competitive Moats & Scalable Growth',
      content: 'Prioritize network effects, high switching costs, and recurring revenue models. Always evaluate market size before expanding capital.',
      category: 'Market Strategy',
      tags: ['Moat', 'Growth', 'Strategy'],
      importance: 'High',
      vectorWeight: 0.95
    },
    {
      id: 'brain-cso-2',
      agentRole: 'CSO',
      timestamp: '2026-08-07T14:30:00Z',
      title: 'CEO Alignment Protocol',
      content: 'Never commit company strategy without CEO sign-off. Present 360-degree risk analysis alongside growth projections.',
      category: 'Governance',
      tags: ['CEO Alignment', 'Governance'],
      importance: 'Critical',
      vectorWeight: 0.98
    }
  ],
  CTO: [
    {
      id: 'brain-cto-1',
      agentRole: 'CTO',
      timestamp: '2026-08-07T10:00:00Z',
      title: 'Client-Side Architecture & Zero Overhead',
      content: 'Prefer client-side state hooks, LocalStorage, and GitHub REST API integration to eliminate server cost bottlenecks and maintain zero latency.',
      category: 'Architecture',
      tags: ['Client-Side', 'Vite', 'GitHub API'],
      importance: 'High',
      vectorWeight: 0.94
    },
    {
      id: 'brain-cto-2',
      agentRole: 'CTO',
      timestamp: '2026-08-07T15:00:00Z',
      title: 'Code Security & Sanitization',
      content: 'All generated code artifacts must be modular, type-safe, and sanitized before deployment.',
      category: 'Security',
      tags: ['Security', 'Sanitization'],
      importance: 'High',
      vectorWeight: 0.92
    }
  ],
  CMO: [
    {
      id: 'brain-cmo-1',
      agentRole: 'CMO',
      timestamp: '2026-08-07T10:00:00Z',
      title: 'Viral GTM Loops & Social Proof',
      content: 'Position product as the "Autonomous Executive Suite for CEOs". Leverage interactive live demos and founder social proof for organic viral growth.',
      category: 'Branding',
      tags: ['GTM', 'Viral Loops', 'Positioning'],
      importance: 'High',
      vectorWeight: 0.91
    }
  ],
  CFO: [
    {
      id: 'brain-cfo-1',
      agentRole: 'CFO',
      timestamp: '2026-08-07T10:00:00Z',
      title: 'Unit Economics & Capital Discipline',
      content: 'Target gross margins above 80%. Payback period must remain under 60 days. Monitor monthly recurring burn rigorously.',
      category: 'Finance',
      tags: ['ROI', 'Unit Economics', 'Margins'],
      importance: 'High',
      vectorWeight: 0.96
    }
  ],
  DEV: [
    {
      id: 'brain-dev-1',
      agentRole: 'DEV',
      timestamp: '2026-08-07T10:00:00Z',
      title: 'Clean Component Contracts',
      content: 'Keep React components focused, use clean prop interfaces, and ensure full cross-browser compatibility.',
      category: 'Development',
      tags: ['React', 'Components', 'Clean Code'],
      importance: 'Medium',
      vectorWeight: 0.90
    }
  ]
};

/**
 * Retrieves memories from an agent's dedicated brain
 */
export const getAgentBrainMemories = (role) => {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}${role}`);
    if (data) return JSON.parse(data);
    return INITIAL_AGENT_BRAINS[role] || [];
  } catch (e) {
    return INITIAL_AGENT_BRAINS[role] || [];
  }
};

/**
 * Saves a memory entry into an agent's dedicated brain
 */
export const addAgentBrainMemory = (role, newMemory) => {
  const current = getAgentBrainMemories(role);
  const memoryObj = {
    id: `brain-${role.toLowerCase()}-${Date.now()}`,
    agentRole: role,
    timestamp: new Date().toISOString(),
    importance: 'High',
    tags: [role, 'Learned Lesson'],
    vectorWeight: 0.88,
    ...newMemory
  };
  const updated = [memoryObj, ...current];
  localStorage.setItem(`${STORAGE_PREFIX}${role}`, JSON.stringify(updated));
  return memoryObj;
};

/**
 * Query an agent's brain for vector context relevant to a user prompt
 */
export const queryAgentBrainVector = (role, queryText) => {
  const brainMemories = getAgentBrainMemories(role);
  if (!brainMemories.length) return '';

  const q = queryText.toLowerCase();
  
  // Rank memories by keyword overlap / vector relevance
  const ranked = brainMemories.map(mem => {
    let score = mem.vectorWeight || 0.5;
    if (mem.title.toLowerCase().includes(q)) score += 0.4;
    if (mem.content.toLowerCase().includes(q)) score += 0.3;
    if (mem.tags.some(t => t.toLowerCase().includes(q))) score += 0.2;
    return { ...mem, score };
  }).sort((a, b) => b.score - a.score);

  return ranked.slice(0, 3).map(m => `[Brain Memory: ${m.title}] ${m.content}`).join('\n');
};
