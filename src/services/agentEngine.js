import { getRelevantMemoryContext, addMemory } from './memoryService';
import { queryAgentBrainVector, addAgentBrainMemory } from './agentBrainService';

/**
 * Intelligent Multi-Agent Engine for CrewOS
 * Supports Natural Human Executive Dialogue, Lead Representative Briefings, and @Tag Mentions.
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
 * Detects if user is asking "what are you working on" or status questions
 */
const isStatusOrWorkQuestion = (text) => {
  const t = text.toLowerCase().trim();
  return t.includes('what are you working on') || t.includes('what you are working on') || t.includes('status update') || t.includes('current progress');
};

/**
 * Extracts tagged roles from message e.g. @CTO, @CFO, @CMO, @DEV, @CSO
 */
export const extractTaggedRoles = (message, crewRoster) => {
  const text = message.toUpperCase();
  const tagged = [];

  crewRoster.forEach(agent => {
    const roleTag = `@${agent.role}`;
    const nameTag = `@${agent.name.split(' ')[0].toUpperCase()}`;
    if (text.includes(roleTag) || text.includes(nameTag)) {
      tagged.push(agent);
    }
  });

  return tagged;
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
 * Interactive Chat Handler:
 * - If CEO tags specific member(s) with @Tag, ONLY tagged member(s) answer in-depth.
 * - If CEO asks group question without tags, ONE Lead Representative (CSO) gives a unified brief!
 */
export const handleCEOChatMessage = async (userMessage, crewRoster, topic, messageHistory, onNewMessage, onFlowStepUpdate) => {
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

  // 2. Check for @Tag mentions
  const taggedAgents = extractTaggedRoles(userMessage, crewRoster);

  let targetResponders = [];

  if (taggedAgents.length > 0) {
    // Respond ONLY with tagged agent(s)
    targetResponders = taggedAgents;
  } else {
    // Group mode without tags -> CSO Lead Representative gives executive brief!
    const leadCSO = crewRoster.find(a => a.role === 'CSO') || crewRoster[1];
    targetResponders = [leadCSO];
  }

  // 3. Sequentially generate responses
  for (let i = 0; i < targetResponders.length; i++) {
    const agent = targetResponders[i];

    if (onFlowStepUpdate) onFlowStepUpdate(agent.role);

    await new Promise(r => setTimeout(r, 650));

    let responseContent = '';

    if (taggedAgents.length === 0 && agent.role === 'CSO' && !isGreetingOrCasual(userMessage) && !isStatusOrWorkQuestion(userMessage)) {
      // Lead Representative Unified Briefing
      const innerResp = await generateAgentResponse(agent, userMessage, [...messageHistory, ceoMsg]);
      responseContent = `${innerResp}\n\n💡 *Tip: If you'd like deeper technical, financial, or marketing specifics, tag any member e.g. @CTO, @CFO, @CMO, or @DEV!*`;
    } else {
      responseContent = await generateAgentResponse(agent, userMessage, [...messageHistory, ceoMsg]);
    }

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

    if (!isGreetingOrCasual(userMessage)) {
      addAgentBrainMemory(agent.role, {
        title: `CEO Interaction: ${userMessage.slice(0, 40)}...`,
        content: `CEO asked: "${userMessage}". Answered: "${responseContent.slice(0, 100)}..."`,
        category: 'CEO Direct Dialogue'
      });
    }
  }

  if (onFlowStepUpdate) onFlowStepUpdate('COMPLETED');
};

/**
 * Simulates real-time boardroom huddle debate amongst selected crew members
 */
export const simulateBoardroomHuddle = async (activeAgents, topic, onNewMessage, onFlowStepUpdate) => {
  const huddleMessages = [];

  for (let i = 0; i < activeAgents.length; i++) {
    const agent = activeAgents[i];
    if (onFlowStepUpdate) onFlowStepUpdate(agent.role);

    await new Promise(r => setTimeout(r, 750));

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
 * Natural Human Conversational AI Engine (NO Echoed Question Strings)
 */
async function simulateHumanAgentResponse(agent, userMessage, globalMemoryContext, agentBrainContext, messageHistory) {
  await new Promise(r => setTimeout(r, 450));

  // Case 1: Casual Greetings
  if (isGreetingOrCasual(userMessage)) {
    const greetings = {
      CSO: `Hello CEO! Doing great. I'm reviewing our market expansion metrics and refining our Q3 growth roadmap. How can I support you?`,
      CTO: `Hey CEO! All systems are green. Production builds are compiling cleanly and our GitHub persistence pipeline is operating with zero latency.`,
      CMO: `Hi boss! Doing fantastic. Our product positioning is set and launch copy assets are ready whenever you want to trigger campaign outreach.`,
      CFO: `Good day, CEO! Financial burn is well under control, gross margins remain above 80%, and payback windows look healthy.`,
      DEV: `Hey CEO! Ready for action. Code modules are structured and sprint tickets are queued up for GitHub dispatch.`,
      PLANNER: `Hello CEO! All milestones are scheduled and execution pipelines are aligned. How can I help?`
    };
    return greetings[agent.role] || `Hello CEO! Doing great and ready for your direction.`;
  }

  // Case 2: "What are you working on?" status questions
  if (isStatusOrWorkQuestion(userMessage)) {
    const workStatus = {
      CSO: `Right now, I'm analyzing enterprise buyer trends and preparing our Q3 growth vector proposal for your sign-off.`,
      CTO: `I'm optimizing our client-side state architecture, verifying GitHub API persistence hooks, and auditing system security.`,
      CMO: `I'm polishing our GTM launch copy, setting up customer acquisition loops, and preparing ProductHunt & X campaign materials.`,
      CFO: `I'm modeling unit economics for our upcoming product launch, ensuring operating burn stays low and ROI exceeds 300%.`,
      DEV: `I'm writing modular React component contracts, setting up local persistence state, and preparing automated GitHub issue templates.`,
      PLANNER: `I'm organizing sprint milestones, scheduling crew deliverables, and tracking task completion rates.`
    };
    return workStatus[agent.role] || `I'm actively working on our executive directives under your guidance, CEO.`;
  }

  // Case 3: Realistic Human Executive Response on Strategic Topics (NO ECHOED STRINGS)
  const realisticDialogue = {
    CSO: `This initiative aligns directly with our growth strategy. By anchoring against our learned principles, we can establish a defensible market moat while keeping capital burn low.`,
    CTO: `Technically, this is straightforward to build. I recommend using modular JS architecture with GitHub REST API persistence to ensure zero server latency and full data retention.`,
    CMO: `From a brand perspective, the value proposition is sharp. We can craft a high-converting campaign around CEO-controlled AI agent teams to drive rapid organic user signups.`,
    CFO: `Financially, the metrics look solid. Required capital is minimal, projected gross margins exceed 85%, and payback is estimated within 45 to 60 days.`,
    DEV: `Engineering sprint is ready. Once you authorize this directive, I'll generate the production code components and push implementation tickets to GitHub.`,
    PLANNER: `Project milestones mapped into Phase 1 (Architecture), Phase 2 (Implementation), and Phase 3 (GitHub Deployment).`
  };

  return realisticDialogue[agent.role] || `As ${agent.title}, I've analyzed your directive against my agent vector brain and recommend proceeding with aligned execution.`;
}

/**
 * Google Gemini API Handler
 */
async function callGeminiAPI(apiKey, agent, userMessage, globalMemoryContext, agentBrainContext, messageHistory) {
  const prompt = `System Prompt: You are ${agent.name}, ${agent.title} at our company. Speak naturally as a human executive colleague to the CEO. Do NOT echo or quote the user's question back (never use phrases like "Regarding '...'"). Answer directly and conversationally in 2-3 sentences.

Your Agent Brain Memories:
${agentBrainContext || 'No prior agent specific memories.'}

Company Shared Memory:
${globalMemoryContext}

CEO User Message: "${userMessage}"
Recent Conversation:
${messageHistory.map(m => `${m.agentRole}: ${m.content}`).join('\n')}

Respond naturally as ${agent.name} (${agent.title}).`;

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
