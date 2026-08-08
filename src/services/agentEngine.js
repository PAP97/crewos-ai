import { getRelevantMemoryContext, addMemory } from './memoryService';
import { queryAgentBrainVector, addAgentBrainMemory } from './agentBrainService';
import { evaluateCEOIntentAndClarify, bifurcateDirectiveIntoSubTasks, auditSubTaskQuality } from './cooWorkflowService';

/**
 * Intelligent Multi-Agent Engine for CrewOS
 * Features COO Executive Liaison, Aria Vance Sub-Task Bifurcation,
 * GitHub Projects Tracking, and Closed-Loop QA Re-Assignment.
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
    /^hello\b/, /^hi\b/, /^hey\b/, /how are you/, /good morning/, /good afternoon/, /whats up/, /what's up/
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
      reasoning: 'Direct conversational reply (No internal huddle needed)',
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

  // 1. Aria Vance opens internal sub-chat with chosen specialists
  internalSubChatLog.push({
    id: `sub-${Date.now()}-cso-init`,
    timestamp: new Date().toISOString(),
    agentRole: 'CSO',
    agentName: 'Aria Vance',
    avatar: '♟️',
    content: `[Internal Sub-Chat] Team, CEO asked: "${userMessage}". Consulting specialists (${selectedRoles.join(', ')}) to verify our Vector Brain memories before presenting our briefing.`
  });

  // 2. Consult each selected specialist
  for (const agent of targetCrew) {
    if (onStep) onStep(`Consulting ${agent.role} ${agent.name}...`);
    await new Promise(r => setTimeout(r, 500));

    let specialistContent = '';

    if (agent.role === 'CTO') {
      specialistContent = `[CTO Tech Audit] Querying CTO Vector Brain: Architecture is feasible. Modular client state with GitHub REST persistence ensures zero latency and full retention.`;
    } else if (agent.role === 'CFO') {
      specialistContent = `[CFO Financial Audit] Querying CFO Vector Brain: Financial burn is under control. Estimated payback period remains under 60 days with >80% gross margins.`;
    } else if (agent.role === 'CMO') {
      specialistContent = `[CMO GTM Review] Querying CMO Vector Brain: Product positioning is sharp. High organic conversion expected around CEO governance storytelling.`;
    } else if (agent.role === 'DEV') {
      specialistContent = `[DEV Implementation Review] Querying DEV Vector Brain: Sprint tickets mapped. Ready to generate code assets and push sub-tasks to GitHub.`;
    } else {
      specialistContent = `[${agent.role} Internal Review] Querying ${agent.role} Vector Brain: Domain analysis aligned with company goals.`;
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

  // 3. Aria Vance consensus summary
  internalSubChatLog.push({
    id: `sub-${Date.now()}-cso-summary`,
    timestamp: new Date().toISOString(),
    agentRole: 'CSO',
    agentName: 'Aria Vance',
    avatar: '♟️',
    content: `[CSO Consensus] Consulted specialists (${selectedRoles.join(', ')}) aligned. Presenting unified executive briefing to COO & CEO.`
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
 * Interactive Chat Handler with COO Requirement Clarification,
 * Aria Vance Sub-Task Bifurcation, and QA Re-Assignment Loops.
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
    if (onFlowStepUpdate) onFlowStepUpdate('COO Orion Vance: Requesting CEO Requirement Clarification');
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
      content: `Hello CEO! I received your directive: "${userMessage}". To ensure Aria Vance and the team execute this with 100% precision, could you clarify:\n\n1. ${clarificationCheck.questions[0]}\n2. ${clarificationCheck.questions[1]}\n\nOnce you confirm, I will immediately brief Aria Vance to bifurcate sub-tasks and trigger execution!`,
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
  
  // Perform QA Audits on sub-tasks (simulating closed-loop QA audit)
  const auditedSubTasks = rawSubTasks.map(st => auditSubTaskQuality(st));

  const leadCSO = crewRoster.find(a => a.role === 'CSO') || crewRoster[2];
  const mainResponse = await generateAgentResponse(leadCSO, userMessage, [...messageHistory, ceoMsg]);

  let finalContent = `[Briefing via COO Orion Vance]\n${mainResponse}`;
  
  // Include Sub-Task Breakdown Summary
  const reAssignedTasks = auditedSubTasks.filter(st => st.status === 'REASSIGNED_NEEDS_REVISION');
  if (reAssignedTasks.length > 0) {
    finalContent += `\n\n⚠️ **CSO QA Audit Alert**: Aria Vance audited sub-tasks. ${reAssignedTasks.length} sub-task(s) failed initial QA and were re-assigned with feedback:\n`;
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

  if (isGreetingOrCasual(userMessage)) {
    const greetings = {
      COO: `Hello CEO! Orion Vance here. Operational synchronization is active. I am standing by to clarify your directives, brief Aria Vance, and track closed-loop QA sub-tasks. How can I assist?`,
      CSO: `Hello CEO! Doing great. I'm reviewing our market expansion metrics and ready to bifurcate your directives into sub-tasks for GitHub Projects tracking.`,
      CTO: `Hey CEO! All systems are green. Production builds are compiling cleanly and our GitHub persistence pipeline is operating with zero latency.`,
      CMO: `Hi boss! Doing fantastic. Our product positioning is set and launch copy assets are ready whenever you want to trigger campaign outreach.`,
      CFO: `Good day, CEO! Financial burn is well under control, gross margins remain above 80%, and payback windows look healthy.`,
      DEV: `Hey CEO! Ready for action. Code modules are structured and sprint tickets are queued up for GitHub dispatch.`,
      PLANNER: `Hello CEO! All milestones are scheduled and execution pipelines are aligned. How can I help?`
    };
    return greetings[agent.role] || `Hello CEO! Doing great and ready for your direction.`;
  }

  if (isStatusOrWorkQuestion(userMessage)) {
    const workStatus = {
      COO: `Right now, I'm synchronizing executive briefs between you (CEO) and Aria Vance (CSO), ensuring all sub-task QA audits pass before reporting back.`,
      CSO: `I'm bifurcating approved CEO directives into sub-tasks, pushing issue tickets to GitHub Projects, and auditing sub-task QA quality.`,
      CTO: `I'm optimizing our client-side state architecture, verifying GitHub API persistence hooks, and auditing system security.`,
      CMO: `I'm polishing our GTM launch copy, setting up customer acquisition loops, and preparing ProductHunt & X campaign materials.`,
      CFO: `I'm modeling unit economics for our upcoming product launch, ensuring operating burn stays low and ROI exceeds 300%.`,
      DEV: `I'm writing modular React component contracts, setting up local persistence state, and preparing automated GitHub issue templates.`,
      PLANNER: `I'm organizing sprint milestones, scheduling crew deliverables, and tracking task completion rates.`
    };
    return workStatus[agent.role] || `I'm actively working on our executive directives under your guidance, CEO.`;
  }

  const realisticDialogue = {
    COO: `I have received your directive and aligned requirements. I've briefed Aria Vance (CSO) to bifurcate the sub-tasks, log them on GitHub Projects, and run closed-loop QA audits.`,
    CSO: `Directive received via COO Orion Vance. I have bifurcated this into 4 sub-tasks across CTO, CFO, CMO, and DEV. Closed-loop QA auditing is active; any sub-task failing quality check will be automatically re-assigned with feedback.`,
    CTO: `Technically, this is straightforward to build. I recommend using modular JS architecture with GitHub REST API persistence to ensure zero server latency and full data retention.`,
    CMO: `From a brand perspective, the value proposition is sharp. We can craft a high-converting campaign around CEO-controlled AI agent teams to drive rapid organic user signups.`,
    CFO: `Financially, the metrics look solid. Required capital is minimal, projected gross margins exceed 85%, and payback is estimated within 45 to 60 days.`,
    DEV: `Engineering sprint is ready. Once you authorize this directive, I'll generate the production code components and push implementation sub-tasks to GitHub.`,
    PLANNER: `Project milestones mapped into Phase 1 (Architecture), Phase 2 (Implementation), and Phase 3 (GitHub Deployment).`
  };

  return realisticDialogue[agent.role] || `As ${agent.title}, I've analyzed your directive against my agent vector brain and recommend proceeding with aligned execution.`;
}

async function callGeminiAPI(apiKey, agent, userMessage, globalMemoryContext, agentBrainContext, messageHistory) {
  const prompt = `System Prompt: You are ${agent.name}, ${agent.title} at our company. Speak naturally as a human executive colleague to the CEO. Do NOT echo or quote the user's question back. Answer directly and conversationally in 2-3 sentences.

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
