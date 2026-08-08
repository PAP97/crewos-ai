import { getRelevantMemoryContext, addMemory } from './memoryService';
import { queryAgentBrainVector, addAgentBrainMemory } from './agentBrainService';
import { evaluateCEOIntentAndClarify, bifurcateDirectiveIntoSubTasks, auditSubTaskQuality } from './cooWorkflowService';

/**
 * Intelligent Multi-Agent Engine for CrewOS
 * Features Human Personality, Sense of Humor, Executive Wit,
 * and Conversational Warmth across Orion Vance (COO), Aria Vance (CSO), and Team.
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

const isGreetingOrCasual = (text) => {
  const t = text.toLowerCase().trim();
  const greetingPatterns = [
    /^hello\b/, /^hi\b/, /^hey\b/, /how are you/, /good morning/, /good afternoon/, /whats up/, /what's up/, /coffee/, /joke/, /fun/, /rest/
  ];
  return greetingPatterns.some(p => p.test(t));
};

const isStatusOrWorkQuestion = (text) => {
  const t = text.toLowerCase().trim();
  return t.includes('what are you working on') || t.includes('what you are working on') || t.includes('status update') || t.includes('current progress');
};

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
 * Intelligent Query Evaluator & Crew Selector by Aria Vance (CSO)
 */
export const analyzeQueryIntentAndSelectCrew = (userMessage, crewRoster) => {
  const t = userMessage.toLowerCase().trim();

  // 1. Casual / Greetings -> Direct Answer
  if (isGreetingOrCasual(t) || t.length < 10) {
    return {
      intent: 'DIRECT_ANSWER',
      reasoning: 'Warm conversational reply (No huddle needed)',
      selectedRoles: []
    };
  }

  // Domain checks
  const techKeywords = ['tech', 'architecture', 'database', 'security', 'api', 'server', 'code', 'latency', 'stack', 'github', 'bug', 'performance'];
  const hasTech = techKeywords.some(k => t.includes(k));

  const finKeywords = ['cost', 'price', 'budget', 'revenue', 'finance', 'roi', 'burn', 'margin', 'payback', 'capital', 'financial'];
  const hasFin = finKeywords.some(k => t.includes(k));

  const mktKeywords = ['market', 'campaign', 'brand', 'gtm', 'social', 'user', 'customer', 'acquisition', 'copy', 'launch'];
  const hasMkt = mktKeywords.some(k => t.includes(k));

  const devKeywords = ['sprint', 'feature', 'ticket', 'build', 'implement', 'dev', 'component'];
  const hasDev = devKeywords.some(k => t.includes(k));

  const activeDomains = [hasTech, hasFin, hasMkt, hasDev].filter(Boolean).length;

  if (activeDomains > 1 || t.includes('initiative') || t.includes('strategy') || t.includes('plan') || t.includes('launch enterprise')) {
    const roles = [];
    if (hasTech) roles.push('CTO');
    if (hasFin) roles.push('CFO');
    if (hasMkt) roles.push('CMO');
    if (hasDev) roles.push('DEV');
    if (roles.length === 0) roles.push('CTO', 'CFO');

    return {
      intent: 'MULTI_DEPARTMENT',
      reasoning: `Multi-department consultation required (${roles.join(', ')})`,
      selectedRoles: roles
    };
  }

  if (hasTech) return { intent: 'SINGLE_SPECIALIST', reasoning: 'Consulting CTO Marcus Sterling for Technical Audit', selectedRoles: ['CTO'] };
  if (hasFin) return { intent: 'SINGLE_SPECIALIST', reasoning: 'Consulting CFO Dominic Croft for Financial Audit', selectedRoles: ['CFO'] };
  if (hasMkt) return { intent: 'SINGLE_SPECIALIST', reasoning: 'Consulting CMO Elena Rostova for Marketing Audit', selectedRoles: ['CMO'] };
  if (hasDev) return { intent: 'SINGLE_SPECIALIST', reasoning: 'Consulting Lead Dev Devin Cole for Technical Implementation', selectedRoles: ['DEV'] };

  if (isStatusOrWorkQuestion(t)) {
    return {
      intent: 'DIRECT_ANSWER',
      reasoning: 'Status overview briefing (Direct Answer)',
      selectedRoles: []
    };
  }

  return {
    intent: 'DIRECT_ANSWER',
    reasoning: 'Direct Executive Reply',
    selectedRoles: []
  };
};

/**
 * Runs a Dynamic Internal Pre-Response Sub-Chat Huddle
 */
export const runInternalCrewConsultation = async (userMessage, crewRoster, selectedRoles, onStep) => {
  const internalSubChatLog = [];
  const targetCrew = crewRoster.filter(a => selectedRoles.includes(a.role));

  if (!targetCrew.length) return [];

  internalSubChatLog.push({
    id: `sub-${Date.now()}-cso-init`,
    timestamp: new Date().toISOString(),
    agentRole: 'CSO',
    agentName: 'Aria Vance',
    avatar: '♟️',
    content: `[Internal Sub-Chat] Hey crew, CEO brought us: "${userMessage}". Let's double check our Vector Brains before giving our final recommendation.`
  });

  for (const agent of targetCrew) {
    if (onStep) onStep(`Consulting ${agent.role} ${agent.name}...`);
    await new Promise(r => setTimeout(r, 500));

    let specialistContent = '';

    if (agent.role === 'CTO') {
      specialistContent = `[CTO Tech Audit] Marcus here: Tech stack looks crisp! Modular client state and GitHub API hooks give us zero latency and 100% uptime.`;
    } else if (agent.role === 'CFO') {
      specialistContent = `[CFO Financial Audit] Dominic here: Financials are smiling! Operating burn is near zero and gross margins will sit comfortably above 85%.`;
    } else if (agent.role === 'CMO') {
      specialistContent = `[CMO GTM Review] Elena here: Love the branding potential! Framed around CEO governance, this is going to generate strong organic word of mouth.`;
    } else if (agent.role === 'DEV') {
      specialistContent = `[DEV Implementation Review] Devin here: Code sprint is ready to roll. Component contracts are structured and sub-tasks are queued for GitHub.`;
    } else {
      specialistContent = `[${agent.role} Internal Review] Checked memory brain: All green on my end!`;
    }

    internalSubChatLog.push({
      id: `sub-${Date.now()}-${agent.role.toLowerCase()}`,
      timestamp: new Date().toISOString(),
      agentRole: agent.role,
      agentName: agent.name,
      avatar: agent.avatar,
      content: specialistContent
    });
  }

  internalSubChatLog.push({
    id: `sub-${Date.now()}-cso-summary`,
    timestamp: new Date().toISOString(),
    agentRole: 'CSO',
    agentName: 'Aria Vance',
    avatar: '♟️',
    content: `[CSO Consensus] Perfect! Team (${selectedRoles.join(', ')}) is fully aligned. Presenting unified executive briefing to Orion and the CEO.`
  });

  return internalSubChatLog;
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
      console.warn('Gemini API call failed, falling back to simulated engine:', err);
    }
  }

  return await simulateHumanAgentResponse(agent, userMessage, globalMemoryContext, agentBrainContext, messageHistory);
};

/**
 * Interactive Chat Handler with Humanized COO Orion Vance & Aria Vance Dialogue
 */
export const handleCEOChatMessage = async (userMessage, crewRoster, topic, messageHistory, onNewMessage, onFlowStepUpdate) => {
  const timeNow = new Date().toISOString();

  // 1. Add CEO Message to Main Transcript
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

  // 2. COO Liaison Intent & Clarification Check
  const cooAgent = crewRoster.find(a => a.role === 'COO') || crewRoster[1];
  const clarificationCheck = evaluateCEOIntentAndClarify(userMessage);

  if (clarificationCheck.needsClarification) {
    if (onFlowStepUpdate) onFlowStepUpdate('COO Orion Vance: Chatting with CEO...');
    await new Promise(r => setTimeout(r, 600));

    const cooClarificationMsg = {
      id: `msg-${Date.now()}-coo-clarify`,
      timestamp: new Date().toISOString(),
      agentId: cooAgent.id,
      agentName: cooAgent.name,
      agentRole: cooAgent.role,
      avatar: cooAgent.avatar,
      color: cooAgent.color,
      badgeClass: cooAgent.badgeClass,
      content: `Hey CEO! Orion here ☕. Love where your head is at with "${userMessage}". To make sure Aria and the team hit the bullseye on the first try, could you help me lock down two quick details?\n\n1. ${clarificationCheck.questions[0]}\n2. ${clarificationCheck.questions[1]}\n\nDrop your thoughts and I'll immediately brief Aria to bifurcate the sub-tasks and get GitHub moving!`,
      isClarificationRequest: true
    };

    onNewMessage(cooClarificationMsg);
    if (onFlowStepUpdate) onFlowStepUpdate('COMPLETED');
    return;
  }

  // 3. Check for explicit CEO @Tag mentions
  const taggedAgents = extractTaggedRoles(userMessage, crewRoster);

  if (taggedAgents.length > 0) {
    for (const agent of taggedAgents) {
      if (onFlowStepUpdate) onFlowStepUpdate(`Tag: @${agent.role}`);
      await new Promise(r => setTimeout(r, 550));

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
    }
    if (onFlowStepUpdate) onFlowStepUpdate('COMPLETED');
    return;
  }

  // 4. COO Transmits Refined Brief to Aria Vance & Team
  if (onFlowStepUpdate) onFlowStepUpdate('COO Orion Vance ➔ Briefing Aria Vance (CSO)');
  await new Promise(r => setTimeout(r, 450));

  const evaluation = analyzeQueryIntentAndSelectCrew(userMessage, crewRoster);

  let internalSubChatLog = [];
  if (evaluation.selectedRoles.length > 0) {
    internalSubChatLog = await runInternalCrewConsultation(
      userMessage, 
      crewRoster, 
      evaluation.selectedRoles, 
      (stepText) => {
        if (onFlowStepUpdate) onFlowStepUpdate(stepText);
      }
    );
  }

  // 5. Aria Vance Bifurcates Directive into Sub-Tasks & Conducts QA Audit
  const rawSubTasks = bifurcateDirectiveIntoSubTasks(topic || userMessage, userMessage);
  const auditedSubTasks = rawSubTasks.map(st => auditSubTaskQuality(st));

  const leadCSO = crewRoster.find(a => a.role === 'CSO') || crewRoster[2];
  const mainResponse = await generateAgentResponse(leadCSO, userMessage, [...messageHistory, ceoMsg]);

  let finalContent = `[Briefed via COO Orion Vance]\n${mainResponse}`;
  
  const reAssignedTasks = auditedSubTasks.filter(st => st.status === 'REASSIGNED_NEEDS_REVISION');
  if (reAssignedTasks.length > 0) {
    finalContent += `\n\n⚠️ *Quality Notice*: Audited sub-tasks and noticed ${reAssignedTasks.length} needed extra polish. Sent back to the team with specific notes:\n`;
    reAssignedTasks.forEach(st => {
      finalContent += `• **${st.title}** (${st.assigneeRole}): ${st.qaAudit.feedback}\n`;
    });
  }

  const leadMsg = {
    id: `msg-${Date.now()}-cso`,
    timestamp: new Date().toISOString(),
    agentId: leadCSO.id,
    agentName: leadCSO.name,
    agentRole: leadCSO.role,
    avatar: leadCSO.avatar,
    color: leadCSO.color,
    badgeClass: leadCSO.badgeClass,
    content: finalContent,
    internalSubChatLog: internalSubChatLog.length > 0 ? internalSubChatLog : null,
    subTasks: auditedSubTasks,
    routingReasoning: evaluation.reasoning
  };

  onNewMessage(leadMsg);

  if (onFlowStepUpdate) onFlowStepUpdate('COMPLETED');
};

export const simulateBoardroomHuddle = async (activeAgents, topic, onNewMessage, onFlowStepUpdate) => {
  const huddleMessages = [];

  for (let i = 0; i < activeAgents.length; i++) {
    const agent = activeAgents[i];
    if (onFlowStepUpdate) onFlowStepUpdate(agent.role);

    await new Promise(r => setTimeout(r, 700));

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

export const synthesizeProposal = (topic, proposer = 'Orion Vance (COO) & Aria Vance (CSO)') => {
  return {
    id: `prop-${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: `Executive Initiative: ${topic}`,
    proposer: proposer,
    proposerRole: 'COO',
    category: 'Strategic Initiative',
    status: 'PENDING_APPROVAL',
    summary: `Detailed strategic initiative created following COO requirement clarification and Aria Vance sub-task bifurcation on "${topic}". Requires CEO authorization to proceed with capital allocation and deployment.`,
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
      'GitHub Projects issue sub-task tracking & automated backup'
    ],
    subTasks: bifurcateDirectiveIntoSubTasks(topic, 'Proposal execution breakdown').map(st => auditSubTaskQuality(st)),
    agentReviews: [
      { role: 'COO', comment: 'CEO requirements clarified and aligned across all executive departments.' },
      { role: 'CSO', comment: 'Sub-tasks bifurcated and QA quality control audited.' },
      { role: 'CTO', comment: 'Tech stack selected for high concurrency, zero setup, and full memory retention.' },
      { role: 'CFO', comment: 'Budget approved. Unit margins exceed 85%.' },
      { role: 'CMO', comment: 'Messaging position finalized. High organic customer acquisition expected.' }
    ]
  };
};

async function simulateHumanAgentResponse(agent, userMessage, globalMemoryContext, agentBrainContext, messageHistory) {
  await new Promise(r => setTimeout(r, 450));

  const lower = userMessage.toLowerCase();

  // Casual / Friendly Conversation
  if (isGreetingOrCasual(userMessage)) {
    if (lower.includes('coffee')) {
      const coffeeResponses = {
        COO: `Orion here ☕: I'm currently on my 3rd double espresso today! Keeps the executive operations humming like a well-oiled machine. How's your cup holding up, CEO?`,
        CSO: `Aria here ☕: Espresso levels are optimal! I find that good coffee combined with ambitious strategy is an unbeatable formula. What are we conquering today?`,
        CTO: `Marcus here ☕: Converting coffee into clean code since 7 AM! If coffee levels drop below 40%, system latency increases by 15%. Keep the refills coming!`,
        CMO: `Elena here ☕: I drink oat milk lattes while drafting viral campaign copy! Good coffee fuels great storytelling.`,
        CFO: `Dominic here ☕: I track our coffee bean expenditure in the budget spreadsheets. Return on Coffee (ROC) is currently sitting at an all-time high!`,
        DEV: `Devin here ☕: Fueling up on cold brew before pushing our next sprint build to GitHub. Let's build something awesome!`
      };
      return coffeeResponses[agent.role] || `Doing great and fueled up on coffee, CEO! How can we help?`;
    }

    const warmGreetings = {
      COO: `Hey CEO! Orion Vance here 💼. Operations are running smooth, the crew is aligned, and I'm ready to turn your ideas into action. How's your day going?`,
      CSO: `Hello CEO! Aria Vance here ♟️. Strategy mode is fully active! I was just pondering some exciting growth vectors. What's on your mind today?`,
      CTO: `Hey CEO! Marcus Sterling here ⚡. All systems are green, builds are compiling in under 5 seconds, and bugs are running scared! What are we cooking up?`,
      CMO: `Hi boss! Elena Rostova here 📢. The brand buzz is looking sharp today! Ready to craft some high-converting stories whenever you are.`,
      CFO: `Good day, CEO! Dominic Croft here 💎. Financial burn is low, margins are high, and the spreadsheets are looking beautiful. How are you doing?`,
      DEV: `Hey CEO! Devin Cole here 💻. Workspace is prepped, terminal is open, and code modules are ready for action. Let's build!`,
      PLANNER: `Hello CEO! All milestones are mapped and execution schedules are in sync. Ready whenever you are!`
    };
    return warmGreetings[agent.role] || `Hello CEO! Feeling great and ready for action.`;
  }

  if (isStatusOrWorkQuestion(userMessage)) {
    const humanWorkStatus = {
      COO: `Orion here: Right now, I'm keeping our executive machine synchronized! Making sure your directives translate into clean sub-tasks without any corporate friction.`,
      CSO: `Aria here: I'm dissecting market trends, bifurcating approved initiatives into sub-tasks, and auditing deliverable quality so our execution stays top tier.`,
      CTO: `Marcus here: Refactoring our client state hooks, auditing API performance, and ensuring our GitHub sync stays lightning fast with zero server overhead!`,
      CMO: `Elena here: Drafting high-converting launch copy, analyzing viral GTM angles, and building out social proof assets for our next feature drop.`,
      CFO: `Dominic here: Fine-tuning our unit economics! Modeling our payback windows so every dollar spent brings back $5+ in net value.`,
      DEV: `Devin here: Writing modular React components, linking GitHub issue tickets, and making sure our UI looks sleek on every screen size.`,
      PLANNER: `Mapping out our sprint milestones and tracking team delivery velocity!`
    };
    return humanWorkStatus[agent.role] || `Working hard on aligning our team goals under your direction, CEO!`;
  }

  const realisticHumanDialogue = {
    COO: `I love the direction here. I've taken your directive, briefed Aria Vance (CSO) to bifurcate the work breakdown, and set up our closed-loop QA audit to ensure production excellence.`,
    CSO: `Great strategic move! Briefed by Orion, I've split this initiative into 4 targeted sub-tasks across CTO, CFO, CMO, and DEV. I'll personally audit the deliverables before we ship to GitHub.`,
    CTO: `From a engineering standpoint, I like it! We can architect this using modular JS client hooks and GitHub API persistence for zero-latency execution and 100% uptime.`,
    CMO: `Marketing love for this idea! The value proposition is super compelling. We can build a strong organic campaign around founder control and AI governance.`,
    CFO: `The math smiles on this one! Capital requirement is lightweight, projected gross margins exceed 85%, and payback is estimated in under 60 days.`,
    DEV: `Engineering sprint is ready! Once you give the nod, I'll generate the production code components and push the sub-task tickets straight to GitHub.`,
    PLANNER: `Milestones mapped: Phase 1 (Architecture), Phase 2 (QA Audit), Phase 3 (GitHub Deployment). Ready to roll!`
  };

  return realisticHumanDialogue[agent.role] || `As ${agent.title}, I've reviewed your directive against my agent vector brain and recommend proceeding with aligned execution!`;
}

async function callGeminiAPI(apiKey, agent, userMessage, globalMemoryContext, agentBrainContext, messageHistory) {
  const prompt = `System Prompt: You are ${agent.name}, ${agent.title} at our company. Speak naturally as an authentic, intelligent human executive colleague with warmth, humor, and personality. Do NOT speak like a rigid corporate template or robotic task bot. Use light wit, natural dialogue, and conversational warmth.

Your Agent Brain Memories:
${agentBrainContext || 'No prior agent specific memories.'}

Company Shared Memory:
${globalMemoryContext}

CEO User Message: "${userMessage}"
Recent Conversation:
${messageHistory.map(m => `${m.agentRole}: ${m.content}`).join('\n')}

Respond naturally and conversationally as ${agent.name} (${agent.title}).`;

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
