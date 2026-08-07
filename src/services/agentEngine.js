import { getRelevantMemoryContext, addMemory } from './memoryService';

/**
 * Intelligent Multi-Agent Engine for CrewOS
 * Generates role-based responses, cross-agent debates, interactive CEO chat, and structured proposals.
 */

export const getApiKeyConfig = () => {
  try {
    const saved = localStorage.getItem('crewos_api_keys');
    return saved ? JSON.parse(saved) : { provider: 'SIMULATED', apiKey: '' };
  } catch (e) {
    return { provider: 'SIMULATED', apiKey: '' };
  }
};

export const saveApiKeyConfig = (config) => {
  localStorage.setItem('crewos_api_keys', JSON.stringify(config));
};

/**
 * Generates an executive response from a specific crew member
 */
export const generateAgentResponse = async (agent, topic, messageHistory = []) => {
  const memoryContext = getRelevantMemoryContext(topic);
  const apiConfig = getApiKeyConfig();

  if (apiConfig.provider === 'GEMINI' && apiConfig.apiKey) {
    try {
      return await callGeminiAPI(apiConfig.apiKey, agent, topic, memoryContext, messageHistory);
    } catch (err) {
      console.warn('Gemini API call failed, falling back to simulated intelligence engine:', err);
    }
  }

  return await simulateAgentResponse(agent, topic, memoryContext, messageHistory);
};

/**
 * Interactive Chat: Allows CEO to message one or multiple selected crew members
 */
export const handleCEOChatMessage = async (userMessage, selectedAgents, topic, messageHistory, onNewMessage) => {
  const memoryContext = getRelevantMemoryContext(userMessage);

  // 1. Add CEO Message to Chat
  const ceoMsg = {
    id: `msg-${Date.now()}-ceo`,
    timestamp: new Date().toISOString(),
    agentId: 'agent-ceo',
    agentName: 'CEO (User)',
    agentRole: 'CEO',
    avatar: '👑',
    color: '#8b5cf6',
    badgeClass: 'badge-ceo',
    content: userMessage
  };
  onNewMessage(ceoMsg);

  // 2. Filter out CEO from target responders
  const targetCrew = selectedAgents.filter(a => a.role !== 'CEO');
  if (!targetCrew.length) return;

  // 3. Sequentially trigger responses from each selected crew member
  for (const agent of targetCrew) {
    await new Promise(r => setTimeout(r, 700));

    const responseContent = await generateAgentResponse(agent, `${topic} - CEO Direct Inquiry: "${userMessage}"`, [
      ...messageHistory,
      ceoMsg
    ]);

    const msg = {
      id: `msg-${Date.now()}-${agent.role}`,
      timestamp: new Date().toISOString(),
      agentId: agent.id,
      agentName: agent.name,
      agentRole: agent.role,
      avatar: agent.avatar,
      color: agent.color,
      badgeClass: agent.badgeClass,
      content: responseContent
    };

    onNewMessage(msg);
  }
};

/**
 * Simulates real-time boardroom huddle debate amongst selected crew members
 */
export const simulateBoardroomHuddle = async (activeAgents, topic, onNewMessage) => {
  const memoryContext = getRelevantMemoryContext(topic);
  const huddleMessages = [];

  const cso = activeAgents.find(a => a.role === 'CSO') || activeAgents[0];
  if (cso) {
    const msg1 = {
      id: `msg-${Date.now()}-1`,
      timestamp: new Date().toISOString(),
      agentId: cso.id,
      agentName: cso.name,
      agentRole: cso.role,
      avatar: cso.avatar,
      color: cso.color,
      badgeClass: cso.badgeClass,
      content: `Boardroom Huddle initiated regarding "${topic}". From a strategic standpoint, our primary goal is establishing market dominance while referencing our learned principles:\n"${memoryContext.split('\n')[0] || 'Execute with CEO alignment'}"`
    };
    huddleMessages.push(msg1);
    if (onNewMessage) onNewMessage(msg1);
    await new Promise(r => setTimeout(r, 800));
  }

  const cto = activeAgents.find(a => a.role === 'CTO');
  if (cto) {
    const msg2 = {
      id: `msg-${Date.now()}-2`,
      timestamp: new Date().toISOString(),
      agentId: cto.id,
      agentName: cto.name,
      agentRole: cto.role,
      avatar: cto.avatar,
      color: cto.color,
      badgeClass: cto.badgeClass,
      content: `Architecturally, we should build this with zero-latency client state and GitHub API persistence. That ensures complete memory retention and 99.9% uptime with zero server overhead.`
    };
    huddleMessages.push(msg2);
    if (onNewMessage) onNewMessage(msg2);
    await new Promise(r => setTimeout(r, 1000));
  }

  const cfo = activeAgents.find(a => a.role === 'CFO');
  if (cfo) {
    const msg3 = {
      id: `msg-${Date.now()}-3`,
      timestamp: new Date().toISOString(),
      agentId: cfo.id,
      agentName: cfo.name,
      agentRole: cfo.role,
      avatar: cfo.avatar,
      color: cfo.color,
      badgeClass: cfo.badgeClass,
      content: `Financial projection: Cost breakdown is optimized for low operating burn. Projected ROI exceeds 300% within 60 days once CEO approves execution.`
    };
    huddleMessages.push(msg3);
    if (onNewMessage) onNewMessage(msg3);
    await new Promise(r => setTimeout(r, 900));
  }

  const cmo = activeAgents.find(a => a.role === 'CMO');
  if (cmo) {
    const msg4 = {
      id: `msg-${Date.now()}-4`,
      timestamp: new Date().toISOString(),
      agentId: cmo.id,
      agentName: cmo.name,
      agentRole: cmo.role,
      avatar: cmo.avatar,
      color: cmo.color,
      badgeClass: cmo.badgeClass,
      content: `Marketing campaign is mapped. We will position this as the ultimate 'CEO Command Center' — leveraging viral social proof and live interactive demos.`
    };
    huddleMessages.push(msg4);
    if (onNewMessage) onNewMessage(msg4);
    await new Promise(r => setTimeout(r, 900));
  }

  const dev = activeAgents.find(a => a.role === 'DEV');
  if (dev) {
    const msg5 = {
      id: `msg-${Date.now()}-5`,
      timestamp: new Date().toISOString(),
      agentId: dev.id,
      agentName: dev.name,
      agentRole: dev.role,
      avatar: dev.avatar,
      color: dev.color,
      badgeClass: dev.badgeClass,
      content: `Development sprint ready. I will break down implementation into modular components, reactive state hooks, and GitHub Pages build targets upon CEO greenlight.`
    };
    huddleMessages.push(msg5);
    if (onNewMessage) onNewMessage(msg5);
  }

  addMemory({
    authorId: cso ? cso.id : 'agent-cso',
    authorName: cso ? cso.name : 'Aria Vance',
    authorRole: cso ? cso.role : 'CSO',
    category: 'Boardroom Decision',
    title: `Huddle Consensus: ${topic}`,
    content: `Crew aligned on strategic direction for "${topic}". High feasibility confirmed across Tech, Finance, and Marketing. Proposal submitted to CEO Approval Queue.`,
    tags: ['Boardroom Huddle', 'Consensus', topic.split(' ')[0]],
    importance: 'High'
  });

  return huddleMessages;
};

export const synthesizeProposal = (topic, proposer = 'Aria Vance (CSO)') => {
  return {
    id: `prop-${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: `Executive Initiative: ${topic}`,
    proposer: proposer,
    proposerRole: 'CSO',
    category: 'Strategic Initiative',
    status: 'PENDING_APPROVAL',
    summary: `Detailed strategic initiative created following Crew Huddle alignment on "${topic}". Requires CEO authorization to proceed with capital allocation and deployment.`,
    financialImpact: {
      budgetRequired: '$3,500',
      estimatedRevenue: '$28,000 / month',
      paybackPeriod: '1.2 Months'
    },
    riskAssessment: 'Low Risk — High market demand with rapid prototyping capability.',
    deliverables: [
      `Production implementation plan for ${topic}`,
      'Technical architecture specification & API design',
      'Multi-channel GTM campaign launch assets',
      'GitHub repository deployment & automated backup'
    ],
    agentReviews: [
      { role: 'CSO', comment: 'Strong market opportunity; strategic fit is 95% aligned with company goals.' },
      { role: 'CTO', comment: 'Tech stack selected for high concurrency, zero setup, and full memory retention.' },
      { role: 'CFO', comment: 'Budget approved. Unit margins exceed 85%.' },
      { role: 'CMO', comment: 'Messaging position finalized. High organic customer acquisition expected.' }
    ]
  };
};

async function simulateAgentResponse(agent, topic, memoryContext, messageHistory) {
  await new Promise(r => setTimeout(r, 600));

  const roleResponses = {
    CSO: `From a strategic perspective regarding "${topic}", we should align our growth vectors with market demand and anchor against our learned charter.`,
    CTO: `Technical perspective on "${topic}": We can architect this cleanly using modular JS components and GitHub REST persistence for reliable zero-latency execution.`,
    CMO: `Marketing perspective on "${topic}": The value proposition is compelling. We can launch targeted campaigns with high viral potential.`,
    CFO: `Financial audit for "${topic}": Low capital burn with high margin potential. Payback period is estimated under 60 days.`,
    DEV: `Engineering perspective on "${topic}": Sprint tasks are mapped out. Code deliverables ready to build as soon as CEO greenlights.`,
    PLANNER: `Project plan for "${topic}": Milestones structured into Phase 1 (Design), Phase 2 (Implementation), and Phase 3 (GitHub Deployment).`
  };

  return roleResponses[agent.role] || `As ${agent.title}, I recommend proceeding with aligned execution on "${topic}" under strict CEO governance.`;
}

async function callGeminiAPI(apiKey, agent, topic, memoryContext, messageHistory) {
  const prompt = `System Prompt: ${agent.systemPrompt}
Shared Crew Memory:
${memoryContext}

Context/Topic: ${topic}
Discussion History:
${messageHistory.map(m => `${m.agentRole}: ${m.content}`).join('\n')}

Respond as ${agent.name} (${agent.title}). Keep response concise, insightful, and strategic (max 3 sentences).`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text.trim();
}
