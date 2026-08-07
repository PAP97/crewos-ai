/**
 * @typedef {'CEO' | 'CSO' | 'CTO' | 'CMO' | 'CFO' | 'DEV' | 'PLANNER' | 'CUSTOM'} AgentRole
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
    description: 'Ultimate authority. Approves strategic directives, monitors crew performance, sets enterprise goals.',
    capabilities: ['Final Approval', 'Strategic Mandates', 'Resource Allocation', 'Crew Governance'],
    systemPrompt: 'You are the visionary CEO leading an autonomous C-suite team.',
    status: 'Active'
  },
  {
    id: 'agent-cso',
    name: 'Aria Vance',
    title: 'Chief Strategy Officer',
    role: 'CSO',
    avatar: '♟️',
    color: '#06b6d4',
    badgeClass: 'badge-cso',
    description: 'Formulates growth roadmaps, analyzes competitive moats, identifies market opportunities.',
    capabilities: ['Market Analysis', 'Growth Strategy', 'Competitive Moats', 'Risk Auditing'],
    systemPrompt: 'You are the Chief Strategy Officer. Focus on high-level market positioning, scalable growth vectors, and long-term vision.',
    status: 'Active'
  },
  {
    id: 'agent-cto',
    name: 'Marcus Sterling',
    title: 'Chief Technology Officer',
    role: 'CTO',
    avatar: '⚡',
    color: '#3b82f6',
    badgeClass: 'badge-cto',
    description: 'Architects system infrastructure, technical stack choices, scalability, and security standards.',
    capabilities: ['System Architecture', 'Tech Stack Evaluation', 'Security & Scale', 'Code Review'],
    systemPrompt: 'You are the CTO. Evaluate technical feasibility, modern system design, API contracts, security, and developer efficiency.',
    status: 'Active'
  },
  {
    id: 'agent-cmo',
    name: 'Elena Rostova',
    title: 'Chief Marketing Officer',
    role: 'CMO',
    avatar: '📢',
    color: '#ec4899',
    badgeClass: 'badge-cmo',
    description: 'Drives brand narrative, multi-channel GTM campaigns, customer acquisition, and copy strategy.',
    capabilities: ['GTM Strategy', 'Brand Identity', 'Copywriting', 'User Acquisition'],
    systemPrompt: 'You are the CMO. Focus on compelling brand storytelling, customer acquisition channels, high-converting copy, and viral loops.',
    status: 'Active'
  },
  {
    id: 'agent-cfo',
    name: 'Dominic Croft',
    title: 'Chief Financial Officer',
    role: 'CFO',
    avatar: '💎',
    color: '#10b981',
    badgeClass: 'badge-cfo',
    description: 'Models unit economics, monitors burn rate, calculates ROI, and allocates capital efficiently.',
    capabilities: ['Financial Modeling', 'Unit Economics', 'Budgeting & Burn Rate', 'ROI Projection'],
    systemPrompt: 'You are the CFO. Rigorously analyze costs, projected revenue, ROI, pricing models, and cash flow sustainability.',
    status: 'Active'
  },
  {
    id: 'agent-dev',
    name: 'Devin Cole',
    title: 'Lead Systems Developer',
    role: 'DEV',
    avatar: '💻',
    color: '#f59e0b',
    badgeClass: 'badge-dev',
    description: 'Translates approved specs into clean, modular code, technical documentation, and sprint tasks.',
    capabilities: ['Frontend & Backend Code', 'API Design', 'Sprint Tasks', 'Testing & CI/CD'],
    systemPrompt: 'You are the Lead Developer. Turn approved architecture plans into executable code, clean APIs, and concrete task tickets.',
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
    title: 'CrewOS Core Charter & Operational Protocol',
    content: 'All crew members must operate collaboratively. Major strategic decisions, technical shifts, and marketing expenditures require CEO explicit approval before execution. All insights are remembered across sessions.',
    tags: ['Charter', 'Governance', 'CEO Protocol'],
    importance: 'High'
  },
  {
    id: 'mem-2',
    timestamp: '2026-08-07T10:30:00Z',
    authorId: 'agent-cso',
    authorName: 'Aria Vance',
    authorRole: 'CSO',
    category: 'Market Intelligence',
    title: 'AI Multi-Agent Ecosystem Trends',
    content: 'Specialized agent swarms with human-in-the-loop CEO approval gates outperform single monolithic LLMs by 4.2x in decision reliability.',
    tags: ['Market Benchmark', 'Agentic Workflows'],
    importance: 'Medium'
  }
];

export const INITIAL_PROPOSALS = [
  {
    id: 'prop-101',
    createdAt: '2026-08-07T14:20:00Z',
    title: 'Launch Enterprise AI Crew Command Suite (v1.0)',
    proposer: 'Aria Vance (CSO)',
    proposerRole: 'CSO',
    category: 'Product Strategy',
    status: 'PENDING_APPROVAL', // PENDING_APPROVAL | APPROVED | REJECTED | REVISION_REQUESTED
    summary: 'Proposing a full launch of our Executive AI Crew Platform targeting tech leaders and founders who want an autonomous C-suite team.',
    financialImpact: {
      budgetRequired: '$5,000',
      estimatedRevenue: '$45,000 / month',
      paybackPeriod: '1.5 Months'
    },
    riskAssessment: 'Low Risk — Software platform with minimal marginal cost.',
    deliverables: [
      'Interactive Boardroom Huddle Interface',
      'CEO Approval Queue with 1-click decision dispatch',
      'Persistent Shared Vector Memory Bank',
      'GitHub Repository Backup & Page Hosting'
    ],
    agentReviews: [
      { role: 'CTO', comment: 'Architecture is modular and runs 100% client-side with zero latency bottlenecks.' },
      { role: 'CFO', comment: 'Unit economics look solid. Positive cash flow projected by Month 2.' },
      { role: 'CMO', comment: 'Go-to-market angle is strong. High viral coefficient on ProductHunt & X.' }
    ]
  }
];
