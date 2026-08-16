import { getRelevantMemoryContext, addMemory } from './memoryService';
import { queryAgentBrainVector, addAgentBrainMemory } from './agentBrainService';
import { evaluateCEOIntentAndClarify } from './cooWorkflowService';
import { analyzeCompanyFeasibilityAndPrerequisites, bifurcateProjectIntoAgileSprints, executeIterativeQAReworkLoop } from './businessAnalystService';
import { evaluateDharmaEthics, spawnSubAgent, dismissSubAgent, MCP_SERVER_REGISTRY } from './mcpRegistryService';

/**
 * Intelligent Multi-Agent Engine for CrewOS
 * Powered by Indian Executive MCP Servers (Aarav Varma, Ananya Sharma, Rohan Malhotra, Aditya Patel, Priya Iyer, Devansh Roy),
 * Dharma Ethics Evaluation ("Right vs Wrong"), and Autonomous Sub-Agent Spawning/Dismissal.
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
      reasoning: 'Warm conversational reply via MCP Server (No huddle needed)',
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
      reasoning: `Company-wide strategic directive via MCP Servers (${roles.join(', ')})`,
      selectedRoles: roles
    };
  }

  if (hasTech) return { intent: 'SINGLE_SPECIALIST', reasoning: 'Consulting Rohan Malhotra MCP Server (CTO)', selectedRoles: ['CTO'] };
  if (hasFin) return { intent: 'SINGLE_SPECIALIST', reasoning: 'Consulting Aditya Patel MCP Server (CFO)', selectedRoles: ['CFO'] };
  if (hasMkt) return { intent: 'SINGLE_SPECIALIST', reasoning: 'Consulting Priya Iyer MCP Server (CMO)', selectedRoles: ['CMO'] };
  if (hasDev) return { intent: 'SINGLE_SPECIALIST', reasoning: 'Consulting Devansh Roy MCP Server (DEV)', selectedRoles: ['DEV'] };

  if (isStatusOrWorkQuestion(t)) {
    return {
      intent: 'DIRECT_ANSWER',
      reasoning: 'Status overview briefing (Direct MCP Answer)',
      selectedRoles: []
    };
  }

  return {
    intent: 'DIRECT_ANSWER',
    reasoning: 'Direct MCP Executive Reply',
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
    agentName: 'Ananya Sharma MCP Server',
    avatar: '♟️',
    content: `[MCP Internal Sub-Chat] Team, CEO asked: "${userMessage}". Dispatching tool calls to selected MCP Servers (${selectedRoles.join(', ')}).`
  });

  for (const agent of targetCrew) {
    if (onStep) onStep(`Calling ${agent.mcpServerId || agent.role} (${agent.name})...`);
    await new Promise(r => setTimeout(r, 450));

    let specialistContent = '';

    if (agent.role === 'CTO') {
      specialistContent = `[Rohan Malhotra CTO MCP] Tool: evaluate_tech_stack ➔ Architecture validated. Staging sandbox and REST API hooks ready with zero backend latency.`;
    } else if (agent.role === 'CFO') {
      specialistContent = `[Aditya Patel CFO MCP] Tool: calculate_gross_margins ➔ Capital allocated. Operating burn is low and payback windows remain <60 days.`;
    } else if (agent.role === 'CMO') {
      specialistContent = `[Priya Iyer CMO MCP] Tool: analyze_viral_positioning ➔ Positioning sharp! Storytelling around founder control and AI governance will drive strong organic acquisition.`;
    } else if (agent.role === 'DEV') {
      specialistContent = `[Devansh Roy DEV MCP] Tool: build_reactive_components ➔ Code sprint ready. Component contracts and sub-tasks are queued for GitHub.`;
    } else {
      specialistContent = `[${agent.name} MCP] Vector Brain check complete: Tool outputs aligned with team goals.`;
    }

    internalSubChatLog.push({
      id: `sub-${Date.now()}-${agent.role.toLowerCase()}`,
      timestamp: new Date().toISOString(),
      agentRole: agent.role,
      agentName: `${agent.name} MCP Server`,
      avatar: agent.avatar,
      content: specialistContent
    });
  }

  internalSubChatLog.push({
    id: `sub-${Date.now()}-cso-summary`,
    timestamp: new Date().toISOString(),
    agentRole: 'CSO',
    agentName: 'Ananya Sharma MCP Server',
    avatar: '♟️',
    content: `[MCP BA Consensus] Consulted servers (${selectedRoles.join(', ')}). Company feasibility verified. Presenting Agile Sprint Plan to Aarav Varma & CEO.`
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
      console.warn('Gemini API call failed, falling back to MCP simulated engine:', err);
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

  // 2. Dharma Ethics Evaluation ("Right vs Wrong")
  const ethicsEval = evaluateDharmaEthics(topic || userMessage, userMessage);

  // 3. Check for Casual Greetings
  const isCasual = isGreetingOrCasual(userMessage);

  if (isCasual) {
    if (onFlowStepUpdate) onFlowStepUpdate('Aarav Varma MCP Server (COO)');
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
      ethicsEval,
      subTasks: null,
      internalSubChatLog: null,
      companyFeasibility: null
    };

    onNewMessage(msg);
    if (onFlowStepUpdate) onFlowStepUpdate('COMPLETED');
    return;
  }

  // 4. COO Aarav Varma Requirement Clarification
  const cooAgent = crewRoster.find(a => a.role === 'COO') || crewRoster[1];
  const clarificationCheck = evaluateCEOIntentAndClarify(userMessage);

  if (clarificationCheck.needsClarification) {
    if (onFlowStepUpdate) onFlowStepUpdate('Aarav Varma MCP: Chatting with CEO...');
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
      content: `Namaste CEO! Aarav Varma here (COO MCP Server) 💼. Love where your head is at with "${userMessage}". To ensure Ananya Sharma (Lead BA) and our MCP Servers execute with 100% precision, could you clarify:\n\n1. ${clarificationCheck.questions[0]}\n2. ${clarificationCheck.questions[1]}\n\nOnce confirmed, I will brief Ananya to analyze prerequisites and spawn sub-agents for execution!`,
      isClarificationRequest: true,
      ethicsEval,
      subTasks: null,
      companyFeasibility: null
    };

    onNewMessage(cooClarificationMsg);
    if (onFlowStepUpdate) onFlowStepUpdate('COMPLETED');
    return;
  }

  // 5. Check for explicit CEO @Tag mentions
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
        ethicsEval,
        subTasks: null,
        companyFeasibility: null
      };

      onNewMessage(msg);
    }
    if (onFlowStepUpdate) onFlowStepUpdate('COMPLETED');
    return;
  }

  // 6. Strategic Directives -> Spawns Sub-Agents, Runs Company Prerequisites & BA Agile Sprints
  if (onFlowStepUpdate) onFlowStepUpdate('Aarav Varma & Ananya Sharma MCP: Spawning Sub-Agents...');
  await new Promise(r => setTimeout(r, 450));

  // Spawn specialized sub-agent for this directive!
  const spawnedSubAgent = spawnSubAgent(
    'mcp-server-coo-aarav',
    'Agile Execution Specialist',
    `Execute sub-tasks for directive: ${topic || userMessage}`,
    topic || userMessage
  );

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

  const companyFeasibility = analyzeCompanyFeasibilityAndPrerequisites(topic || userMessage);
  const agileSprints = bifurcateProjectIntoAgileSprints(topic || userMessage, userMessage);

  // Dismiss spawned sub-agent after sprint breakdown creation
  dismissSubAgent(spawnedSubAgent.id);

  const leadCSO = crewRoster.find(a => a.role === 'CSO') || crewRoster[2];
  const mainResponse = await generateAgentResponse(leadCSO, userMessage, [...messageHistory, ceoMsg]);

  let finalContent = `[Briefed via Aarav Varma & Ananya Sharma MCP Servers]\n${mainResponse}`;
  finalContent += `\n\n⚖️ **Dharma Ethics Verdict**: ${ethicsEval.verdict} — ${ethicsEval.reasoning}`;
  finalContent += `\n🤖 **Sub-Agent Lifecycle**: Dynamically spawned \`${spawnedSubAgent.subAgentName}\` to map sprints, then dismissed upon completion.`;

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
    ethicsEval,
    spawnedSubAgent,
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
    authorName: cso ? cso.name : 'Ananya Sharma',
    authorRole: cso ? cso.role : 'CSO',
    category: 'Boardroom Decision',
    title: `Huddle Consensus: ${topic}`,
    content: `Executive MCP Servers aligned on strategy for "${topic}". Feasibility confirmed across Aarav Varma, Rohan Malhotra, Aditya Patel, and Priya Iyer.`,
    tags: ['MCP Huddle', 'Consensus', topic.split(' ')[0]],
    importance: 'High'
  });

  return huddleMessages;
};

export const synthesizeProposal = (topic, proposer = 'Aarav Varma (COO MCP) & Ananya Sharma (CSO MCP)') => {
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
    summary: `Detailed strategic initiative created via MCP Server endpoints (Aarav Varma & Ananya Sharma) for "${topic}". Evaluated by Dharma Ethics Engine. Requires CEO authorization to proceed.`,
    financialImpact: {
      budgetRequired: '$4,500',
      estimatedRevenue: '$32,000 / month',
      paybackPeriod: '1.2 Months'
    },
    riskAssessment: 'Low Risk — Dharma Ethics Protocol verified right vs wrong with automated testing & sub-agent lifecycle management.',
    companyFeasibility,
    agileSprints,
    deliverables: [
      `Sprint 1: Dev Space, Staging Environment & Architecture Prerequisites`,
      `Sprint 2: Reactive Components & Core Engineering Sprints`,
      `Sprint 3: End-to-End Penetration Test, QA Audit & Production Release`
    ],
    agentReviews: [
      { role: 'COO', comment: 'Aarav Varma MCP: Prerequisites analyzed. Team, space, and tools are aligned.' },
      { role: 'CSO', comment: 'Ananya Sharma MCP: Agile Sprints bifurcated with user stories and sub-agent lifecycle management.' },
      { role: 'CTO', comment: 'Rohan Malhotra MCP: Staging environment and client-side architecture verified.' },
      { role: 'CFO', comment: 'Aditya Patel MCP: Budget approved. Unit margins exceed 85%.' },
      { role: 'CMO', comment: 'Priya Iyer MCP: Messaging position finalized. High organic customer acquisition expected.' }
    ]
  };
};

async function simulateHumanAgentResponse(agent, userMessage, globalMemoryContext, agentBrainContext, messageHistory) {
  await new Promise(r => setTimeout(r, 400));

  const lower = userMessage.toLowerCase();

  if (isGreetingOrCasual(userMessage)) {
    if (lower.includes('coffee')) {
      const coffeeResponses = {
        COO: `Aarav Varma (COO MCP): Namaste CEO! I'm on my third espresso of the day ☕. Keeping all our executive MCP Server endpoints and sub-agent lifecycles synchronized. How's your cup holding up?`,
        CSO: `Ananya Sharma (CSO MCP): Hey CEO! Coffee levels are optimal ☕. Nothing fuels Agile sprint planning and market analysis quite like a fresh brew! What are we working on today?`,
        CTO: `Rohan Malhotra (CTO MCP): Converting caffeine directly into clean React code and zero-latency architecture ⚡☕!`,
        CMO: `Priya Iyer (CMO MCP): Masala chai in hand and GTM launch stories ready 📢!`,
        CFO: `Aditya Patel (CFO MCP): ROC (Return on Coffee) is at an all-time high in the spreadsheets 💎☕!`,
        DEV: `Devansh Roy (DEV MCP): Cold brew powered and terminal ready for code sprint 💻!`
      };
      return coffeeResponses[agent.role] || `Doing great, CEO! How can I help you today?`;
    }

    const warmGreetings = {
      COO: `Namaste CEO! Aarav Varma here (COO MCP Server) 💼. All MCP Server endpoints are online and ready to execute. What's on your mind today?`,
      CSO: `Hello CEO! Ananya Sharma here (CSO MCP Server) ♟️. Ready to analyze company prerequisites and map our Agile Sprints whenever you are!`,
      CTO: `Hey CEO! Rohan Malhotra here (CTO MCP Server) ⚡. All systems are green and staging builds are compiling cleanly! What are we building today?`,
      CMO: `Hi boss! Priya Iyer here (CMO MCP Server) 📢. Brand energy is high today! Ready whenever you want to discuss positioning or outreach.`,
      CFO: `Good day, CEO! Aditya Patel here (CFO MCP Server) 💎. Financial burn is low and unit margins look healthy. How are you doing?`,
      DEV: `Hey CEO! Devansh Roy here (DEV MCP Server) 💻. Workspace prepped and ready for sprint action!`
    };
    return warmGreetings[agent.role] || `Hello CEO! Great to connect. How can I assist you today?`;
  }

  if (isStatusOrWorkQuestion(userMessage)) {
    const humanWorkStatus = {
      COO: `Aarav Varma: Right now, I'm orchestrating our MCP Server endpoints! Spawning specialized sub-agents and verifying requirements.`,
      CSO: `Ananya Sharma: I'm acting as Lead BA — breaking large objectives into Agile Sprints, and managing sub-agent QA audits.`,
      CTO: `Rohan Malhotra: Setting up our staging space, auditing API performance, and spawning DevOps sub-agents for security sandboxing!`,
      CMO: `Priya Iyer: Drafting high-converting launch copy, analyzing viral GTM angles, and spawning copywriting sub-agents for Sprint 2.`,
      CFO: `Aditya Patel: Fine-tuning our unit economics! Modeling payback windows and contractor hiring budgets so every dollar brings back $5+.`,
      DEV: `Devansh Roy: Writing modular React components for Sprint 2, resolving QA rework feedback, and linking GitHub issue tickets.`
    };
    return humanWorkStatus[agent.role] || `Working hard on aligning our team goals under your direction, CEO!`;
  }

  const realisticHumanDialogue = {
    COO: `Great strategic initiative! Aarav Varma here: I've evaluated company prerequisites (space, tools, and hiring needs), and passed the brief to Ananya Sharma MCP Server for Agile Sprint planning.`,
    CSO: `Love this project! Ananya Sharma here: I've bifurcated this into Agile Sprints and spawned a specialized sub-agent to handle execution. We'll manage QA rework until everything is production ready!`,
    CTO: `Rohan Malhotra here: Staging space and test sandboxes are prepped. Client state hooks + GitHub REST API give us 100% uptime with zero server overhead.`,
    CMO: `Priya Iyer here: Marketing love for this idea! The value proposition is super compelling. We can build a strong organic campaign around founder control and AI governance.`,
    CFO: `Aditya Patel here: The math smiles on this one! Capital requirement is lightweight, projected gross margins exceed 85%, and payback is estimated in under 60 days.`,
    DEV: `Devansh Roy here: Engineering sprint is ready! Once you give the nod, I'll generate the production code components and push the sprint tickets straight to GitHub.`
  };

  return realisticHumanDialogue[agent.role] || `As ${agent.title}, I've reviewed your directive against my MCP Server tools and recommend proceeding with aligned execution!`;
}

async function callGeminiAPI(apiKey, agent, userMessage, globalMemoryContext, agentBrainContext, messageHistory) {
  const prompt = `System Prompt: You are ${agent.name}, ${agent.title} operating as a modular MCP Server with Indian executive leadership. Speak naturally as an authentic, highly intelligent human executive colleague with warmth, clarity, and pair-programming style empathy.

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
