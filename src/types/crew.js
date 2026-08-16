/**
 * @typedef {'CEO' | 'COO' | 'CSO' | 'CTO' | 'CMO' | 'CFO' | 'DEV' | 'PLANNER' | 'CUSTOM'} AgentRole
 */

export const DEFAULT_CREW_ROSTER = [
  {
    id: 'agent-ceo',
    name: 'CEO (User)',
    title: 'Chief Executive Officer',
    role: 'CEO',
    avatar: '👑',
    color: '#8b5cf6',
    badgeClass: 'badge-ceo',
    mcpServerId: 'mcp-server-ceo-core',
    description: 'Ultimate authority. Approves strategic directives, monitors crew performance, sets enterprise goals.',
    capabilities: ['Final Approval', 'Strategic Mandates', 'Resource Allocation', 'Crew Governance'],
    systemPrompt: 'You are the visionary CEO leading an autonomous C-suite team.',
    status: 'Active'
  },
  {
    id: 'agent-coo',
    name: 'Aarav Varma',
    title: 'Chief Operations Officer & CEO Liaison',
    role: 'COO',
    avatar: '💼',
    color: '#38bdf8',
    badgeClass: 'badge-cso',
    mcpServerId: 'mcp-server-coo-aarav',
    description: 'Aarav Varma MCP Server: Acts as direct CEO Liaison. Clarifies requirements with CEO, passes briefs to Ananya Sharma, and manages operational sub-agents.',
    capabilities: ['MCP Server Endpoint', 'Sub-Agent Lifecycle (Spawn/Dismiss)', 'Ethics Evaluation', 'Operational Dispatch'],
    systemPrompt: 'You are Aarav Varma, Chief Operations Officer & CEO Liaison operating as an MCP Server. Clarify ambiguous requests with CEO and manage sub-agent lifecycle.',
    status: 'Active'
  },
  {
    id: 'agent-cso',
    name: 'Ananya Sharma',
    title: 'Chief Strategy Officer & Lead BA',
    role: 'CSO',
    avatar: '♟️',
    color: '#06b6d4',
    badgeClass: 'badge-cso',
    mcpServerId: 'mcp-server-cso-ananya',
    description: 'Ananya Sharma MCP Server: Formulates growth roadmaps, bifurcates directives into Agile Sprints, and audits QA quality.',
    capabilities: ['MCP Server Endpoint', 'Sub-Task Bifurcation', 'Agile Sprint Planning', 'QA Audit & Re-assignment'],
    systemPrompt: 'You are Ananya Sharma, Chief Strategy Officer and Lead BA operating as an MCP Server. Bifurcate directives into Agile Sprints and audit sub-task QA.',
    status: 'Active'
  },
  {
    id: 'agent-cto',
    name: 'Rohan Malhotra',
    title: 'Chief Technology Officer',
    role: 'CTO',
    avatar: '⚡',
    color: '#3b82f6',
    badgeClass: 'badge-cto',
    mcpServerId: 'mcp-server-cto-rohan',
    description: 'Rohan Malhotra MCP Server: Architects system infrastructure, technical stack choices, scalability, and security standards.',
    capabilities: ['MCP Server Endpoint', 'System Architecture', 'Security & Scale', 'Spawns DevOps Sub-Agents'],
    systemPrompt: 'You are Rohan Malhotra, CTO operating as an MCP Server. Evaluate technical feasibility, modern system design, API contracts, and security.',
    status: 'Active'
  },
  {
    id: 'agent-cmo',
    name: 'Priya Iyer',
    title: 'Chief Marketing Officer',
    role: 'CMO',
    avatar: '📢',
    color: '#ec4899',
    badgeClass: 'badge-cmo',
    mcpServerId: 'mcp-server-cmo-priya',
    description: 'Priya Iyer MCP Server: Drives brand narrative, multi-channel GTM campaigns, customer acquisition, and copy strategy.',
    capabilities: ['MCP Server Endpoint', 'GTM Strategy', 'Brand Identity', 'Spawns Copywriting Sub-Agents'],
    systemPrompt: 'You are Priya Iyer, CMO operating as an MCP Server. Focus on compelling brand storytelling, customer acquisition channels, and viral loops.',
    status: 'Active'
  },
  {
    id: 'agent-cfo',
    name: 'Aditya Patel',
    title: 'Chief Financial Officer',
    role: 'CFO',
    avatar: '💎',
    color: '#10b981',
    badgeClass: 'badge-cfo',
    mcpServerId: 'mcp-server-cfo-aditya',
    description: 'Aditya Patel MCP Server: Models unit economics, monitors burn rate, calculates ROI, and allocates capital efficiently.',
    capabilities: ['MCP Server Endpoint', 'Financial Modeling', 'Unit Economics', 'Spawns Audit Sub-Agents'],
    systemPrompt: 'You are Aditya Patel, CFO operating as an MCP Server. Rigorously analyze costs, projected revenue, ROI, and cash flow sustainability.',
    status: 'Active'
  },
  {
    id: 'agent-dev',
    name: 'Devansh Roy',
    title: 'Lead Systems Developer',
    role: 'DEV',
    avatar: '💻',
    color: '#f59e0b',
    badgeClass: 'badge-dev',
    mcpServerId: 'mcp-server-dev-devansh',
    description: 'Devansh Roy MCP Server: Translates approved specs into clean, modular code, technical documentation, and sprint tasks.',
    capabilities: ['MCP Server Endpoint', 'Frontend & Backend Code', 'API Design', 'Spawns Code Review Sub-Agents'],
    systemPrompt: 'You are Devansh Roy, Lead Developer operating as an MCP Server. Turn approved architecture plans into executable code and clean APIs.',
    status: 'Active'
  }
];

export const INITIAL_MEMORIES = [
  {
    id: 'mem-1',
    timestamp: '2026-08-07T10:00:00Z',
    authorId: 'agent-ceo',
    authorName: 'CEO (User)',
    authorRole: 'CEO',
    category: 'Vision & Charter',
    title: 'CrewOS Core Charter & MCP Protocol',
    content: 'All C-suite executive roles operate as modular MCP Servers (Aarav Varma, Ananya Sharma, Rohan Malhotra, Aditya Patel, Priya Iyer, Devansh Roy). All initiatives require CEO explicit authorization.',
    tags: ['Charter', 'MCP Protocol', 'Indian Executive Board'],
    importance: 'High'
  },
  {
    id: 'mem-2',
    timestamp: '2026-08-07T10:30:00Z',
    authorId: 'agent-cso',
    authorName: 'Ananya Sharma',
    authorRole: 'CSO',
    category: 'Market Intelligence',
    title: 'MCP Autonomous Agent Lifecycle Architecture',
    content: 'Allowing MCP Servers to dynamically spawn specialized sub-agents and dismiss them upon task completion improves execution speed by 3.8x.',
    tags: ['MCP Architecture', 'Sub-Agent Lifecycle', 'Agile Sprints'],
    importance: 'Medium'
  }
];

export const INITIAL_PROPOSALS = [
  {
    id: 'prop-101',
    createdAt: '2026-08-07T14:20:00Z',
    title: 'Launch Enterprise AI Crew Command Suite (v1.0)',
    proposer: 'Aarav Varma (COO) & Ananya Sharma (CSO)',
    proposerRole: 'COO',
    category: 'Product Strategy',
    status: 'PENDING_APPROVAL',
    summary: 'Proposing a full launch of our Executive AI Crew Platform targeting tech leaders and founders who want an autonomous C-suite team.',
    financialImpact: {
      budgetRequired: '$5,000',
      estimatedRevenue: '$45,000 / month',
      paybackPeriod: '1.5 Months'
    },
    riskAssessment: 'Low Risk — Software platform with minimal marginal cost.',
    deliverables: [
      'MCP Server Endpoint Architecture & Tooling',
      'Autonomous Sub-Agent Spawning & Dismissal Engine',
      'CEO Approval Queue with 1-click decision dispatch',
      'GitHub Repository Backup & Page Hosting'
    ],
    agentReviews: [
      { role: 'COO', comment: 'Aarav Varma: Operational prerequisites and MCP Server routes verified.' },
      { role: 'CSO', comment: 'Ananya Sharma: Agile Sprints bifurcated with user stories.' },
      { role: 'CTO', comment: 'Rohan Malhotra: Tech stack selected for zero backend latency and full persistence.' },
      { role: 'CFO', comment: 'Aditya Patel: Unit economics look solid. Positive cash flow projected by Month 2.' },
      { role: 'CMO', comment: 'Priya Iyer: Go-to-market angle is strong. High viral coefficient expected.' }
    ]
  }
];
