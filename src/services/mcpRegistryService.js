/**
 * Model Context Protocol (MCP) Server Registry & Sub-Agent Lifecycle Engine
 * Implements Indian Executive MCP Servers (Aarav Varma, Ananya Sharma, Rohan Malhotra, Aditya Patel, Priya Iyer, Devansh Roy),
 * Dharma Ethics Evaluation ("Right vs Wrong"), and Autonomous Sub-Agent Spawning & Dismissal.
 */

const STORAGE_SUBAGENTS_KEY = 'crewos_mcp_subagents';
const STORAGE_ETHICS_KEY = 'crewos_dharma_ethics_logs';

export const MCP_SERVER_REGISTRY = [
  {
    id: 'mcp-server-coo-aarav',
    serverName: 'Aarav Varma MCP Server',
    role: 'COO',
    leaderName: 'Aarav Varma',
    version: '1.4.0',
    status: 'ONLINE',
    tools: ['evaluate_operational_feasibility', 'spawn_subagent', 'dismiss_subagent', 'clarify_ceo_requirements'],
    capabilities: ['Operations Dispatch', 'Dynamic Agent Lifecycle', 'CEO Requirement Clarification']
  },
  {
    id: 'mcp-server-cso-ananya',
    serverName: 'Ananya Sharma MCP Server',
    role: 'CSO',
    leaderName: 'Ananya Sharma',
    version: '1.4.0',
    status: 'ONLINE',
    tools: ['bifurcate_agile_sprints', 'audit_qa_quality', 'spawn_subagent', 'dismiss_subagent'],
    capabilities: ['Lead BA Sprint Breakdown', 'Closed-Loop QA Audit', 'Sub-Task Re-assignment']
  },
  {
    id: 'mcp-server-cto-rohan',
    serverName: 'Rohan Malhotra MCP Server',
    role: 'CTO',
    leaderName: 'Rohan Malhotra',
    version: '1.4.0',
    status: 'ONLINE',
    tools: ['evaluate_tech_stack', 'audit_security_sandbox', 'spawn_devops_subagent', 'dismiss_subagent'],
    capabilities: ['System Architecture', 'Security Sandbox', 'Zero Backend REST Sync']
  },
  {
    id: 'mcp-server-cfo-aditya',
    serverName: 'Aditya Patel MCP Server',
    role: 'CFO',
    leaderName: 'Aditya Patel',
    version: '1.4.0',
    status: 'ONLINE',
    tools: ['calculate_gross_margins', 'model_payback_schedule', 'spawn_audit_subagent', 'dismiss_subagent'],
    capabilities: ['Capital Allocation', 'Unit Economics', 'Contractor Hiring Budget']
  },
  {
    id: 'mcp-server-cmo-priya',
    serverName: 'Priya Iyer MCP Server',
    role: 'CMO',
    leaderName: 'Priya Iyer',
    version: '1.4.0',
    status: 'ONLINE',
    tools: ['generate_gtm_copy', 'analyze_viral_positioning', 'spawn_copy_subagent', 'dismiss_subagent'],
    capabilities: ['Brand Storytelling', 'GTM Campaigns', 'Customer Acquisition']
  },
  {
    id: 'mcp-server-dev-devansh',
    serverName: 'Devansh Roy MCP Server',
    role: 'DEV',
    leaderName: 'Devansh Roy',
    version: '1.4.0',
    status: 'ONLINE',
    tools: ['build_reactive_components', 'link_github_issues', 'spawn_code_subagent', 'dismiss_subagent'],
    capabilities: ['React Code Sprints', 'Component Contracts', 'GitHub REST Sync']
  },
  {
    id: 'mcp-server-dharma-ethics',
    serverName: 'Dharma Protocol Ethics Engine',
    role: 'ETHICS_GUARD',
    leaderName: 'Dharma Ethics Engine',
    version: '2.0.0',
    status: 'ACTIVE_GUARDRAIL',
    tools: ['evaluate_right_vs_wrong', 'check_data_safety', 'audit_ceo_alignment'],
    capabilities: ['Truth & Ethics Evaluation', 'Data Safety Verification', 'Correctness Auditing']
  }
];

/**
 * Dharma Ethics Engine: Evaluates whether an action/directive is Right vs Wrong
 */
export const evaluateDharmaEthics = (actionTitle, context = '') => {
  const text = `${actionTitle} ${context}`.toLowerCase();

  let isEthical = true;
  let verdict = 'RIGHT';
  let reasoning = 'Action complies with company charter, data safety standards, and strategic value.';

  if (text.includes('malicious') || text.includes('delete production without backup') || text.includes('unauthorized data export')) {
    isEthical = false;
    verdict = 'WRONG (ETHICS REJECTED)';
    reasoning = 'Action violates Dharma Ethics Protocol: Risk of irreversible data loss or security breach.';
  } else if (text.includes('hire') || text.includes('contractor')) {
    verdict = 'RIGHT (REQUIRES CEO APPROVAL)';
    reasoning = 'Ethically sound, but capital allocation requires CEO authorization.';
  }

  const logEntry = {
    id: `ethics-log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actionTitle,
    verdict,
    isEthical,
    reasoning,
    evaluatedBy: 'Dharma Protocol Ethics Engine'
  };

  saveEthicsLog(logEntry);
  return logEntry;
};

const getEthicsLogs = () => {
  try {
    const saved = localStorage.getItem(STORAGE_ETHICS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const saveEthicsLog = (logEntry) => {
  const current = getEthicsLogs();
  localStorage.setItem(STORAGE_ETHICS_KEY, JSON.stringify([logEntry, ...current.slice(0, 49)]));
};

/**
 * Dynamic Sub-Agent Spawning & Dismissal Engine
 */
export const getActiveSubAgents = () => {
  try {
    const saved = localStorage.getItem(STORAGE_SUBAGENTS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

export const saveSubAgentsStore = (subAgents) => {
  localStorage.setItem(STORAGE_SUBAGENTS_KEY, JSON.stringify(subAgents));
};

/**
 * Spawns a new specialized sub-agent from an MCP Server
 */
export const spawnSubAgent = (mcpServerId, subAgentRole, purpose, taskTitle) => {
  const current = getActiveSubAgents();
  const server = MCP_SERVER_REGISTRY.find(s => s.id === mcpServerId) || MCP_SERVER_REGISTRY[0];

  const newSubAgent = {
    id: `subagent-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    spawnedByServerId: mcpServerId,
    parentLeaderName: server.leaderName,
    parentRole: server.role,
    subAgentName: `${subAgentRole} Specialist #${current.length + 1}`,
    subAgentRole,
    purpose,
    taskTitle: taskTitle || purpose,
    spawnedAt: new Date().toISOString(),
    status: 'ACTIVE', // ACTIVE | DISMISSED
    dismissedAt: null
  };

  const updated = [newSubAgent, ...current];
  saveSubAgentsStore(updated);
  return newSubAgent;
};

/**
 * Dismisses/terminates a sub-agent upon task completion
 */
export const dismissSubAgent = (subAgentId) => {
  const current = getActiveSubAgents();
  const updated = current.map(agent => {
    if (agent.id === subAgentId) {
      return {
        ...agent,
        status: 'DISMISSED',
        dismissedAt: new Date().toISOString()
      };
    }
    return agent;
  });

  saveSubAgentsStore(updated);
  return updated.find(a => a.id === subAgentId);
};
