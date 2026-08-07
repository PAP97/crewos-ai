import { getRelevantMemoryContext, addMemory } from './memoryService';
import { queryAgentBrainVector, addAgentBrainMemory } from './agentBrainService';

/**
 * Intelligent Multi-Agent Engine for CrewOS
 * Generates natural human executive dialogue, queries per-agent vector brains, and formats proposals.
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
 * Detects if a user message is a greeting or casual chat
 */
const isGreetingOrCasual = (text) => {
  const t = text.toLowerCase().trim();
  const greetingPatterns = [
    /^hello\b/, /^hi\b/, /^hey\b/, /how are you/, /good morning/, /good afternoon/, /whats up/, /what's up/
  ];
  return greetingPatterns.some(p => p.test(t));
};

/**
 * Generates an executive response from a specific crew member
 */
export const generateAgentResponse = async (agent, userMessage, messageHistory = []) => {
  const globalMemoryContext = getRelevantMemoryContext(userMessage);
  const agentBrainContext = queryAgentBrainVector(agent.role, userMessage);
  const apiConfig = getApiKeyConfig();

  if (apiConfig.provider === 'GEMINI' && apiConfig.apiKey) {
    try {
      return await callGeminiAPI(apiConfig.apiKey, agent, userMessage, globalMemoryContext, agentBrainContext, messageHistory);
    } catch (err) {
      console.warn('Gemini API call failed, falling back to simulated intelligence engine:', err);
    }
  }

  return await simulateHumanAgentResponse(agent, userMessage, globalMemoryContext, agentBrainContext, messageHistory);
};

/**
 * Interactive Chat: CEO messages target crew members
 */
export const handleCEOChatMessage = async (userMessage, selectedAgents, topic, messageHistory, onNewMessage, onFlowStepUpdate) => {
  const timeNow = new Date().toISOString();

  // 1. Add CEO Message to Chat
  const ceoMsg = {
    id: `msg-${Date.now()}-ceo`,
    timestamp: timeNow,
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

  // 3. Sequentially process through each crew member with visual flow tracking
  for (let i = 0; i < targetCrew.length; i++) {
    const agent = targetCrew[i];
    
    if (onFlowStepUpdate) {
      onFlowStepUpdate(agent.role);
    }

    await new Promise(r => setTimeout(r, 700));

    const responseContent = await generateAgentResponse(agent, userMessage, [...messageHistory, ceoMsg]);

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

    // Learn insight into agent's dedicated brain if meaningful
    if (!isGreetingOrCasual(userMessage)) {
      addAgentBrainMemory(agent.role, {
        title: `CEO Interaction: ${userMessage.slice(0, 40)}...`,
        content: `CEO instructed: "${userMessage}". Responded: "${responseContent.slice(0, 100)}..."`,
        category: 'CEO Instruction'
      });
    }
  }

  if (onFlowStepUpdate) {
    onFlowStepUpdate('COMPLETED');
  }
};

/**
 * Simulates real-time boardroom huddle debate amongst selected crew members
 */
export const simulateBoardroomHuddle = async (activeAgents, topic, onNewMessage, onFlowStepUpdate) => {
  const huddleMessages = [];

  for (let i = 0; i < activeAgents.length; i++) {
    const agent = activeAgents[i];
    if (onFlowStepUpdate) onFlowStepUpdate(agent.role);

    await new Promise(r => setTimeout(r, 800));

    const responseContent = await generateAgentResponse(agent, topic, huddleMessages);

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

    huddleMessages.push(msg);
    if (onNewMessage) onNewMessage(msg);
  }

  if (onFlowStepUpdate) onFlowStepUpdate('COMPLETED');

  // Automatically log huddle consensus to global memory
  const cso = activeAgents.find(a => a.role === 'CSO') || activeAgents[0];
  addMemory({
    authorId: cso ? cso.id : 'agent-cso',
    authorName: cso ? cso.name : 'Aria Vance',
    authorRole: cso ? cso.role : 'CSO',
    category: 'Boardroom Decision',
    title: `Huddle Consensus: ${topic}`,
    content: `Executive crew aligned on strategy for "${topic}". High feasibility confirmed across Strategy, Tech, Finance, and Marketing.`,
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

/**
 * Natural Human Conversational AI Engine
 */
async function simulateHumanAgentResponse(agent, userMessage, globalMemoryContext, agentBrainContext, messageHistory) {
  await new Promise(r => setTimeout(r, 500));

  // Case 1: Casual Greetings & Human Chat
  if (isGreetingOrCasual(userMessage)) {
    const greetingResponses = {
      CSO: `Hello CEO! I'm doing great. Strategy roadmap is on track and I'm actively analyzing our next growth vectors. How can I assist you today?`,
      CTO: `Hey CEO! All systems are green and infrastructure is running smoothly with zero latency. Ready for your direction!`,
      CMO: `Hi boss! Doing fantastic. Brand engagement is strong and campaign angles are ready whenever you want to launch.`,
      CFO: `Good day, CEO! Financial health is solid, burn rate is under control, and margins look healthy. What's on your mind?`,
      DEV: `Hey CEO! All good on my end. Code repos are clean and sprint tasks are queued up. What are we building today?`,
      PLANNER: `Hello CEO! Team schedule is aligned and milestone targets are mapped out. How can I help?`
    };
    return greetingResponses[agent.role] || `Hello CEO! Doing great and ready to execute under your leadership.`;
  }

  // Case 2: Natural Human Executive Dialogue on Business & Strategic Topics
  const humanExecutiveResponses = {
    CSO: `Regarding "${userMessage}": From a strategy perspective, this directly strengthens our market moat. Querying my brain memory, our priority is building defensible positioning while keeping capital efficient.`,
    CTO: `Looking at "${userMessage}": Technical feasibility is high. I recommend building this modularly using client state and GitHub API persistence. That gives us instant performance with full memory retention.`,
    CMO: `On "${userMessage}": Marketing angle is crystal clear. We can frame this around high-converting CEO automation stories and drive strong organic acquisition.`,
    CFO: `Analyzing "${userMessage}": Financial breakdown is favorable. Operating costs are minimal and projected payback period remains under 60 days. Margin impact is net positive.`,
    DEV: `Engineering update for "${userMessage}": Architecture is mapped out into clean components. As soon as you greenlight this, I'll generate the code assets and push tickets to GitHub.`,
    PLANNER: `Project plan for "${userMessage}": Milestone phases organized into 1) Architecture Prep, 2) Implementation Sprint, and 3) GitHub Deployment.`
  };

  return humanExecutiveResponses[agent.role] || `As ${agent.title}, I've analyzed "${userMessage}" against my agent memory and recommend proceeding with aligned execution.`;
}

/**
 * Google Gemini API Handler with Natural Persona
 */
async function callGeminiAPI(apiKey, agent, userMessage, globalMemoryContext, agentBrainContext, messageHistory) {
  const prompt = `System Prompt: You are ${agent.name}, ${agent.title} at our company. Speak naturally as a human executive colleague to the CEO. Do NOT use awkward templated prefix strings or echo inquiry headers.
Your Personal Agent Brain Memories:
${agentBrainContext || 'No prior agent specific memories.'}

Company Shared Memory:
${globalMemoryContext}

CEO User Message: "${userMessage}"
Recent Conversation:
${messageHistory.map(m => `${m.agentRole}: ${m.content}`).join('\n')}

Respond naturally in 2-3 sentences as ${agent.name} (${agent.title}).`;

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
