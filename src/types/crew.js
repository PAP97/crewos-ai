/**
 * @typedef {'CEO' | 'CPO' | 'CTO' | 'CMO' | 'CFO' | 'QA' | 'COO' | 'DEV'} AgentRole
 */

export const DEFAULT_CREW_ROSTER = [
  {
    id: 'agent-ceo',
    name: 'CEO (Strategic Visionary)',
    title: 'Chief Executive Officer',
    role: 'CEO',
    avatar: '👑',
    color: '#8b5cf6',
    badgeClass: 'badge-ceo',
    criticalLens: 'Does this scale? Does this align with our primary north star metric? Is this worth burning capital right now?',
    description: 'Sets company direction, aligns product with PMF, manages capitalization strategies, and makes executive decisions.',
    capabilities: ['Strategic Vision', 'PMF Alignment', 'Capital Allocation', 'Final Executive Approval'],
    status: 'Active'
  },
  {
    id: 'agent-cpo',
    name: 'CPO (User Advocate)',
    title: 'Chief Product Officer',
    role: 'CPO',
    avatar: '🎨',
    color: '#f43f5e',
    badgeClass: 'badge-cmo',
    criticalLens: 'What specific pain point does this solve? Is the user experience intuitive, or are we over-engineering the interface?',
    description: 'Defines product vision, maps user journeys, prioritizes feature backlogs, and oversees UX/UI philosophy.',
    capabilities: ['User Journey Mapping', 'Feature Backlog Prioritization', 'Friction Elimination', 'UX/UI Philosophy'],
    status: 'Active'
  },
  {
    id: 'agent-cto',
    name: 'Rohan Malhotra (CTO)',
    title: 'Chief Technology Officer & Systems Architect',
    role: 'CTO',
    avatar: '⚡',
    color: '#3b82f6',
    badgeClass: 'badge-cto',
    criticalLens: 'Is this infrastructure scalable and reliable? Are we exposing vulnerabilities? How will this integrate with external services and APIs?',
    description: 'Determines technical stack, builds system architecture, designs database schemas, and manages data security and MCP servers.',
    capabilities: ['System Architecture', 'Database Schemas', 'Security & Scale', 'MCP Server Integration'],
    status: 'Active'
  },
  {
    id: 'agent-cmo',
    name: 'Priya Iyer (CMO)',
    title: 'Chief Marketing Officer & Growth Hacker',
    role: 'CMO',
    avatar: '📢',
    color: '#ec4899',
    badgeClass: 'badge-cmo',
    criticalLens: 'Who is the exact target demographic? How do we acquire them cheaply? Is our value proposition immediately obvious?',
    description: 'Develops Go-To-Market (GTM) strategies, defines positioning, acquires users, and builds customer acquisition funnels.',
    capabilities: ['GTM Strategy', 'CAC & LTV Optimization', 'Brand Positioning', 'User Acquisition Funnels'],
    status: 'Active'
  },
  {
    id: 'agent-cfo',
    name: 'Aditya Patel (CFO)',
    title: 'Chief Financial Officer & Fiscal Guardian',
    role: 'CFO',
    avatar: '💎',
    color: '#10b981',
    badgeClass: 'badge-cfo',
    criticalLens: 'What is the margin on this? When do we hit profitability? How does this decision impact our operational runway?',
    description: 'Manages unit economics, models cash flow, monitors burn rate, calculates runway, and designs pricing strategies.',
    capabilities: ['Unit Economics', 'Burn Rate Monitoring', 'Operational Runway', 'Pricing Strategies'],
    status: 'Active'
  },
  {
    id: 'agent-qa',
    name: 'Principal QA (Break-It Expert)',
    title: 'Principal QA & Validation Engineer',
    role: 'QA',
    avatar: '🛡️',
    color: '#06b6d4',
    badgeClass: 'badge-cso',
    criticalLens: 'What happens if this input breaks? Have we validated this market data? What is the explicit error log when this system crashes?',
    description: 'Writes automated verification scripts, sets error boundaries, stress-tests assumptions, and manages self-correction loops.',
    capabilities: ['Automated Verification', 'Error Boundaries', 'Self-Correction Loops', 'Edge Case Stress Testing'],
    status: 'Active'
  }
];

export const INITIAL_MEMORIES = [
  {
    id: 'mem-1',
    timestamp: '2026-08-07T10:00:00Z',
    authorId: 'agent-ceo',
    authorName: 'CEO (Strategic Visionary)',
    authorRole: 'CEO',
    category: 'Vision & Charter',
    title: 'Autonomous Startup Boardroom Protocol',
    content: 'All C-suite members (CEO, CPO, CTO, CMO, CFO, QA) engage in cross-functional debate and test-driven validation. Every deliverable must pass through QA self-correction loops before presenting to the Founder.',
    tags: ['Charter', 'Boardroom Protocol', 'Core 6 Crew'],
    importance: 'High'
  },
  {
    id: 'mem-2',
    timestamp: '2026-08-07T10:30:00Z',
    authorId: 'agent-qa',
    authorName: 'Principal QA Engineer',
    authorRole: 'QA',
    category: 'Validation Standard',
    title: 'Autonomous Self-Correction Loop [Plan ➔ Build ➔ Test ➔ Fix]',
    content: 'Assets are built modularly, verified by automated test gates, and self-corrected autonomously if syntax or logic errors occur.',
    tags: ['QA Gate', 'Self-Correction', 'Validation'],
    importance: 'High'
  }
];

export const INITIAL_PROPOSALS = [
  {
    id: 'prop-101',
    createdAt: '2026-08-07T14:20:00Z',
    title: 'Launch Enterprise AI Startup Boardroom Command Suite (v2.0)',
    proposer: 'CEO (Strategic Visionary) & Core Boardroom',
    proposerRole: 'CEO',
    category: 'Product Strategy',
    status: 'PENDING_APPROVAL',
    summary: 'Proposing a full launch of our Autonomous Startup Boardroom Suite featuring 6 core personas, multi-agent debate protocols, and QA self-correction loops.',
    financialImpact: {
      budgetRequired: '$4,500',
      estimatedRevenue: '$38,000 / month',
      paybackPeriod: '1.2 Months'
    },
    riskAssessment: 'Low Risk — Software platform with zero backend expenditure and full QA validation.',
    deliverables: [
      'Core 6 Personas (CEO, CPO, CTO, CMO, CFO, QA)',
      'Multi-Agent Cross-Functional Debate Protocol',
      'Autonomous Self-Correction Loop [Plan ➔ Build ➔ Test ➔ Fix]',
      'Executive Output Formatting Standard (Debate, Execution Log, Deliverable, Next Steps)'
    ],
    agentReviews: [
      { role: 'CEO', comment: 'Scalable architecture aligned with our PMF and North Star growth metrics.' },
      { role: 'CPO', comment: 'Solves user friction by delivering pristine, verified executive outputs.' },
      { role: 'CTO', comment: 'Infrastructure uses client-side state hooks with 100% uptime on GitHub Pages.' },
      { role: 'CFO', comment: 'Unit margins exceed 85% with operating runway extended.' },
      { role: 'CMO', comment: 'High viral positioning around founder control and AI executive swarms.' },
      { role: 'QA', comment: 'All verification scripts passed with zero syntax errors.' }
    ]
  }
];
