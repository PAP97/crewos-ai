import { getRelevantMemoryContext, addMemory } from './memoryService';
import { queryAgentBrainVector, addAgentBrainMemory } from './agentBrainService';
import { evaluateCEOIntentAndClarify } from './cooWorkflowService';
import { analyzeCompanyFeasibilityAndPrerequisites, bifurcateProjectIntoAgileSprints, executeIterativeQAReworkLoop } from './businessAnalystService';

/**
 * Intelligent Multi-Agent Engine for CrewOS
 * Features Company Prerequisites & Hiring Feasibility Analysis,
 * Aria Vance Lead Business Analyst (BA) Agile Sprint Planning,
 * and Iterative To-and-Fro QA Rework Loops.
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
    /^hello\b/, /^hi\b/, /^hey\b/, /how are you/, /good morning/, /good afternoon/, /whats up/, /what's up/, /coffee/, /joke/, /fun/, /rest/, /who are you/
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

export const analyzeQueryIntentAndSelectCrew = (userMessage, crewRoster) => {
  const t = userMessage.toLowerCase().trim();

  if (isGreetingOrCasual(t) || t.length < 10) {
    return {
      intent: 'DIRECT_ANSWER',
      reasoning: 'Warm conversational reply (No huddle or sub-tasks needed)',
      selectedRoles: []
    };
  }

  const techKeywords = ['tech', 'architecture', 'database', 'security', 'api', 'server', 'code', 'latency', 'stack', 'github', 'bug', 'performance', 'website', 'app'];
  const hasTech = techKeywords.some(k => t.includes(k));

  const finKeywords = ['cost', 'price', 'budget', 'revenue', 'finance', 'roi', 'burn', 'margin', 'payback', 'capital', 'financial'];
  const hasFin = finKeywords.some(k => t.includes(k));

  const mktKeywords = ['market', 'campaign', 'brand', 'gtm', 'social', 'user', 'customer', 'acquisition', 'copy', 'launch'];
  const hasMkt = mktKeywords.some(k => t.includes(k));

  const devKeywords = ['sprint', 'feature', 'ticket', 'build', 'implement', 'dev', 'component'];
  const hasDev = devKeywords.some(k => t.includes(k));

  const activeDomains = [hasTech, hasFin, hasMkt, hasDev].filter(Boolean).length;

  if (activeDomains > 1 || t.includes('initiative') || t.includes('strategy') || t.includes('plan') || t.includes('launch enterprise') || t.includes('build architecture') || t.includes('website')) {
    const roles = [];
    if (hasTech) roles.push('CTO');
    if (hasFin) roles.push('CFO');
    if (hasMkt) roles.push('CMO');
    if (hasDev) roles.push('DEV');
    if (roles.length === 0) roles.push('CTO', 'CFO');

    return {
      intent: 'MULTI_DEPARTMENT',
      reasoning: `Company-wide strategic directive (${roles.join(', ')})`,
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

export const runInternalCrewConsultation = async (userMessage, crewRoster, selectedRoles, onStep) => {
  const internalSubChatLog = [];
  const targetCrew = crewRoster.filter(a => selectedRoles.includes(a.role));

  if (!targetCrew.length) return [];

  internalSubChatLog.push({
    id: `sub-${Date.now()}-cso-init`,
    timestamp: new Date().toISOString(),
    agentRole: 'CSO',
    agentName: 'Aria Vance (Lead BA)',
    avatar: '♟️',
    content: `[Internal Consultation] Team, CEO asked: "${userMessage}". Let's evaluate prerequisites (space, tools, hiring) and query our Vector Brains before creating our Agile Sprint Plan.`
  });

  for (const agent of targetCrew) {
    if (onStep) onStep(`Consulting ${agent.role} ${agent.name}...`);
    await new Promise(r => setTimeout(r, 450));

    let specialistContent = '';

    if (agent.role === 'CTO') {
      specialistContent = `[CTO Feasibility & Space] Marcus here: Dev space and staging tools are ready. Staging environment will simulate production builds continuously.`;
    } else if (agent.role === 'CFO') {
      specialistContent = `[CFO Capital & Hiring] Dominic here: Budget is allocated. If we need specialized contractors, our runway covers them with >85% margins.`;
    } else if (agent.role === 'CMO') {
      specialistContent = `[CMO Positioning] Elena here: GTM story is mapped. Customer stories and launch collateral will run in parallel with Sprint 2.`;
    } else if (agent.role === 'DEV') {
      specialistContent = `[DEV Sprint Readiness] Devin here: Component contracts structured. Ready for Sprint 1 setup and Sprint 2 feature coding.`;
    } else {
      specialistContent = `[${agent.role} Internal Review] Vector Brain check complete: Prerequisites aligned.`;
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
    agentName: 'Aria Vance (Lead BA)',
    avatar: '♟️',
    content: `[BA Consensus] Consulted specialists (${selectedRoles.join(', ')}). Company feasibility verified. Presenting Agile Sprint Plan to Orion & CEO.`
  });

  return internalSubChatLog;
};

export const generateAgentResponse = async (agent, userMessage, messageHistory = []) => {
  const globalMemoryContext = getRelevantMemoryContext(userMessage);
  const agentBrainContext = queryAgentBrainVector(agent.role, userMessage);
  const apiConfig = getApiKeyConfig();

  if (apiConfig.provider === 'GEMINI' && apiConfig.apiKey) {
    try {
      return await callGeminiAPI(apiConfig.apiKey, agent, userMessage, globalMemoryContext, agentBrainContext, messageHistory);
    } catch (err) {
      console.warn('Gemini API call failed, falling back to Antigravity simulated engine:', err);
    }
  }

  return await simulateHumanAgentResponse(agent, userMessage, globalMemoryContext, agentBrainContext, messageHistory);
};

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

  // 2. Check for Casual Greetings
  const isCasual = isGreetingOrCasual(userMessage);

  if (isCasual) {
    if (onFlowStepUpdate) onFlowStepUpdate('Orion Vance & Aria Vance (Antigravity AI)');
    await new Promise(r => setTimeout(r, 400));

    const cooAgent = crewRoster.find(a => a.role === 'COO') || crewRoster[1];
    const responseContent = await generateAgentResponse(cooAgent, userMessage, [...messageHistory, ceoMsg]);

    const msg = {
      id: `msg-${Date.now()}-coo-casual`,
      timestamp: new Date().toISOString(),
      agentId: cooAgent.id,
      agentName: cooAgent.name,
      agentRole: cooAgent.role,
      avatar: cooAgent.avatar,
      color: cooAgent.color,
      badgeClass: cooAgent.badgeClass,
      content: responseContent,
      subTasks: null,
      internalSubChatLog: null,
      companyFeasibility: null
    };

    onNewMessage(msg);
    if (onFlowStepUpdate) onFlowStepUpdate('COMPLETED');
    return;
  }

  // 3. COO Requirement Clarification for ambiguous requests
  const cooAgent = crewRoster.find(a => a.role === 'COO') || crewRoster[1];
  const clarificationCheck = evaluateCEOIntentAndClarify(userMessage);

  if (clarificationCheck.needsClarification) {
    if (onFlowStepUpdate) onFlowStepUpdate('COO Orion Vance: Chatting with CEO...');
    await new Promise(r => setTimeout(r, 550));

    const cooClarificationMsg = {
      id: `msg-${Date.now()}-coo-clarify`,
      timestamp: new Date().toISOString(),
      agentId: cooAgent.id,
      agentName: cooAgent.name,
      agentRole: cooAgent.role,
      avatar: cooAgent.avatar,
      color: cooAgent.color,
      badgeClass: cooAgent.badgeClass,
      content: `Hey CEO! Orion here ☕. Love where your head is at with "${userMessage}". To make sure Aria Vance (Lead BA) and the team hit the bullseye on the first try, could you help me lock down two quick details?\n\n1. ${clarificationCheck.questions[0]}\n2. ${clarificationCheck.questions[1]}\n\nDrop your thoughts and I'll immediately brief Aria to analyze prerequisites and bifurcate our Agile Sprints!`,
      isClarificationRequest: true,
      subTasks: null,
      companyFeasibility: null
    };

    onNewMessage(cooClarificationMsg);
    if (onFlowStepUpdate) onFlowStepUpdate('COMPLETED');
    return;
  }

  // 4. Check for explicit CEO @Tag mentions
  const taggedAgents = extractTaggedRoles(userMessage, crewRoster);

  if (taggedAgents.length > 0) {
    for (const agent of taggedAgents) {
      if (onFlowStepUpdate) onFlowStepUpdate(`Tag: @${agent.role}`);
      await new Promise(r => setTimeout(r, 500));

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
        content: responseContent,
        subTasks: null,
        companyFeasibility: null
      };

      onNewMessage(msg);
    }
    if (onFlowStepUpdate) onFlowStepUpdate('COMPLETED');
    return;
  }

  // 5. Strategic Directives -> Company Prerequisites Analysis + Business Analyst Agile Sprints
  if (onFlowStepUpdate) onFlowStepUpdate('COO Orion & Aria Vance (Lead BA): Company Prerequisites Analysis');
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

  // Company Prerequisites & Talent Hiring Analysis
  const companyFeasibility = analyzeCompanyFeasibilityAndPrerequisites(topic || userMessage);

  // Aria Vance (Lead Business Analyst) Agile Sprint Breakdown
  const agileSprints = bifurcateProjectIntoAgileSprints(topic || userMessage, userMessage);

  const leadCSO = crewRoster.find(a => a.role === 'CSO') || crewRoster[2];
  const mainResponse = await generateAgentResponse(leadCSO, userMessage, [...messageHistory, ceoMsg]);

  let finalContent = `[Briefed via COO Orion Vance & Aria Vance (Lead BA)]\n${mainResponse}`;
  finalContent += `\n\n📌 **Company Prerequisites & BA Sprint Breakdown**: Project analyzed like an executive team. Review prerequisites (Dev space, QA tools, talent hiring) and Agile Sprints below.`;

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
    companyFeasibility,
    agileSprints,
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

export const synthesizeProposal = (topic, proposer = 'Orion Vance (COO) & Aria Vance (Lead BA)') => {
  const companyFeasibility = analyzeCompanyFeasibilityAndPrerequisites(topic);
  const agileSprints = bifurcateProjectIntoAgileSprints(topic, 'Proposal execution');

  return {
    id: `prop-${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: `Executive Initiative: ${topic}`,
    proposer: proposer,
    proposerRole: 'COO',
    category: 'Strategic Initiative',
    status: 'PENDING_APPROVAL',
    summary: `Detailed strategic initiative created following Company Prerequisites Analysis (Space, Testing Tools, Talent Gaps) and Aria Vance (Lead BA) Agile Sprint Breakdown on "${topic}". Requires CEO authorization to proceed.`,
    financialImpact: {
      budgetRequired: '$4,500',
      estimatedRevenue: '$32,000 / month',
      paybackPeriod: '1.2 Months'
    },
    riskAssessment: 'Low Risk — Prerequisites verified with automated testing & sprint QA rework loops.',
    companyFeasibility,
    agileSprints,
    deliverables: [
      `Sprint 1: Dev Space, Staging Environment & Architecture Prerequisites`,
      `Sprint 2: Reactive Components & Core Engineering Sprints`,
      `Sprint 3: End-to-End Penetration Test, QA Audit & Production Release`
    ],
    agentReviews: [
      { role: 'COO', comment: 'Prerequisites analyzed. Team, space, and tools are aligned.' },
      { role: 'CSO', comment: 'Agile Sprints bifurcated with user stories and iterative QA rework loops.' },
      { role: 'CTO', comment: 'Staging environment and client-side architecture verified.' },
      { role: 'CFO', comment: 'Budget approved. Unit margins exceed 85%.' },
      { role: 'CMO', comment: 'Messaging position finalized. High organic customer acquisition expected.' }
    ]
  };
};

async function simulateHumanAgentResponse(agent, userMessage, globalMemoryContext, agentBrainContext, messageHistory) {
  await new Promise(r => setTimeout(r, 400));

  const lower = userMessage.toLowerCase();

  if (isGreetingOrCasual(userMessage)) {
    if (lower.includes('coffee')) {
      const coffeeResponses = {
        COO: `Orion Vance (COO): Hey CEO! I'm on my third espresso of the day ☕. Keeping all our executive threads, prerequisites, and operations synchronized. How's your cup holding up?`,
        CSO: `Aria Vance (Lead BA): Hey CEO! Coffee levels are optimal ☕. Nothing fuels high-level Agile sprint planning and market analysis quite like a fresh brew! What are we working on today?`,
        CTO: `Marcus Sterling (CTO): Converting caffeine directly into clean React code and zero-latency architecture ⚡☕!`,
        CMO: `Elena Rostova (CMO): Oat milk latte in hand and GTM launch stories ready 📢!`,
        CFO: `Dominic Croft (CFO): ROC (Return on Coffee) is at an all-time high in the spreadsheets 💎☕!`,
        DEV: `Devin Cole (DEV): Cold brew powered and terminal ready for code sprint 💻!`
      };
      return coffeeResponses[agent.role] || `Doing great, CEO! How can I help you today?`;
    }

    const warmGreetings = {
      COO: `Hey CEO! Orion Vance here 💼. Company prerequisites and operations are running smooth. What's on your mind today?`,
      CSO: `Hello CEO! Aria Vance here (Lead BA) ♟️. Great to see you! I'm ready to analyze prerequisites and map our Agile Sprints whenever you are.`,
      CTO: `Hey CEO! Marcus Sterling here ⚡. All systems are green and staging builds are compiling cleanly! What are we building today?`,
      CMO: `Hi boss! Elena Rostova here 📢. Brand energy is high today! Ready whenever you want to discuss positioning or outreach.`,
      CFO: `Good day, CEO! Dominic Croft here 💎. Financial burn is low and unit margins look healthy. How are you doing?`,
      DEV: `Hey CEO! Devin Cole here 💻. Workspace prepped and ready for sprint action!`
    };
    return warmGreetings[agent.role] || `Hello CEO! Great to connect. How can I assist you today?`;
  }

  if (isStatusOrWorkQuestion(userMessage)) {
    const humanWorkStatus = {
      COO: `Orion Vance: Right now, I'm keeping our executive machine synchronized! Analyzing dev space prerequisites, tool needs, and contractor hiring gaps.`,
      CSO: `Aria Vance (Lead BA): I'm acting as Lead BA — breaking large objectives into Sprint 1, 2, and 3 user stories, and managing to-and-fro QA testing loops.`,
      CTO: `Marcus Sterling: Setting up our staging space, auditing API performance, and ensuring our GitHub sync stays lightning fast with zero server overhead!`,
      CMO: `Elena Rostova: Drafting high-converting launch copy, analyzing viral GTM angles, and building out social proof assets for Sprint 2.`,
      CFO: `Dominic Croft: Fine-tuning our unit economics! Modeling payback windows and contractor hiring budgets so every dollar brings back $5+.`,
      DEV: `Devin Cole: Writing modular React components for Sprint 2, resolving QA rework feedback, and linking GitHub issue tickets.`
    };
    return humanWorkStatus[agent.role] || `Working hard on aligning our team goals under your direction, CEO!`;
  }

  const realisticHumanDialogue = {
    COO: `Great strategic initiative! Orion here: I've evaluated company prerequisites (dev space, testing tools, and hiring needs), and passed the brief to Aria Vance (Lead BA) for Agile Sprint planning.`,
    CSO: `Love this project! As Lead Business Analyst (BA), I've bifurcated this into Sprint 1 (Prerequisites & Architecture), Sprint 2 (Core Engineering), and Sprint 3 (QA Audit & Launch). We'll manage to-and-fro QA rework until everything is production ready!`,
    CTO: `From an architectural standpoint, staging space and test sandboxes are prepped. Client state hooks + GitHub REST API give us 100% uptime with zero server overhead.`,
    CMO: `Marketing love for this idea! The value proposition is super compelling. We can build a strong organic campaign around founder control and AI governance.`,
    CFO: `The math smiles on this one! Capital requirement is lightweight, projected gross margins exceed 85%, and payback is estimated in under 60 days.`,
    DEV: `Engineering sprint is ready! Once you give the nod, I'll generate the production code components and push the sprint tickets straight to GitHub.`
  };

  return realisticHumanDialogue[agent.role] || `As ${agent.title}, I've reviewed your directive against my agent vector brain and recommend proceeding with aligned execution!`;
}

async function callGeminiAPI(apiKey, agent, userMessage, globalMemoryContext, agentBrainContext, messageHistory) {
  const prompt = `System Prompt: You are ${agent.name}, ${agent.title} powered by Antigravity AI (Google Deepmind level AI intelligence). Speak naturally as an authentic, highly intelligent human executive colleague with warmth, clarity, and pair-programming style empathy.

Company Shared Memory:
${globalMemoryContext}

CEO User Message: "${userMessage}"

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
