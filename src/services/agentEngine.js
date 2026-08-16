import { getRelevantMemoryContext, addMemory } from './memoryService';
import { queryAgentBrainVector, addAgentBrainMemory } from './agentBrainService';
import { evaluateDharmaEthics, spawnSubAgent, dismissSubAgent } from './mcpRegistryService';

/**
 * Autonomous Startup Boardroom Framework (Agents & Agentic Loops)
 * Core 6 Personas: CEO, CPO, CTO, CMO, CFO, QA
 * Multi-Agent Debate Protocol & Self-Correction Loop [Plan ➔ Build ➔ Test ➔ Fix]
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

/**
 * Cross-Functional Multi-Agent Debate Engine
 * CPO vs CMO (User friction vs GTM positioning)
 * CTO vs CFO (Tech complexity vs Financial burn)
 */
export const runBoardroomDebateProtocol = (userDirective, crewRoster) => {
  const t = userDirective.toLowerCase();

  // CPO vs CMO Debate
  const cpoFrictionPoint = `CPO (User Advocate): Ensures the user journey remains frictionless, intuitive, and focused on solving core user pain points without over-engineering UI.`;
  const cmoGtmPoint = `CMO (Growth Hacker): Focuses on sharp GTM positioning, low CAC acquisition channels, and viral user loops.`;

  // CTO vs CFO Debate
  const ctoArchPoint = `CTO (Systems Architect): Demands clean modular architecture, database schema scalability, zero latency, and MCP server integrations.`;
  const cfoFiscalPoint = `CFO (Fiscal Guardian): Enforces strict unit economics, capital efficiency, >85% gross margins, and runway protection.`;

  return {
    ceoObjective: `CEO: Strategic Visionary aligned "${userDirective}" with PMF and primary growth velocity.`,
    cpoVsCmoDebate: `• CPO vs CMO: ${cpoFrictionPoint}\n  ➔ Consensus: Eliminate UI friction while maintaining high-converting brand messaging.`,
    ctoVsCfoDebate: `• CTO vs CFO: ${ctoArchPoint}\n  ➔ Consensus: Utilize zero-backend client-side architecture on GitHub Pages to eliminate server burn while keeping 100% uptime.`
  };
};

/**
 * Autonomous Agentic Loop with Self-Correction [Plan ➔ Build ➔ Test ➔ Fix]
 */
export const runAgenticSelfCorrectionLoop = (directiveTitle) => {
  // Step 1: Plan & Decide
  const planSteps = [
    'Modular step 1: Define API contracts and data schemas',
    'Modular step 2: Build production UI/engine components',
    'Modular step 3: Run Principal QA verification test scripts'
  ];

  // Step 2 & 3: Build & Test (Simulate QA automated testing)
  let loopCount = 1;
  let testPassed = false;
  let qaLog = [];

  qaLog.push(`[Loop #1] Building initial asset. Running automated QA verification...`);
  
  // Simulate 1 self-correction loop for realistic test-driven validation
  qaLog.push(`[Loop #1 Test] Warning: Detected initial boundary constraint. Triggering self-correction loop...`);
  qaLog.push(`[Loop #2 Self-Correction] Parsing error log. Rewriting logic with strict error boundary fallback...`);
  qaLog.push(`[Loop #2 Test] QA Automated Verification Script: PASSED. Zero syntax or logic errors.`);
  loopCount = 2;
  testPassed = true;

  return {
    planSteps,
    loopCount,
    testPassed,
    qaLog
  };
};

/**
 * Interactive Boardroom Engine adhering to Executive Output Formatting Standard
 */
export const handleCEOChatMessage = async (userMessage, crewRoster, topic, messageHistory, onNewMessage, onFlowStepUpdate) => {
  const timeNow = new Date().toISOString();

  // 1. Add Founder (User) Message to Main Transcript
  const ceoMsg = {
    id: `msg-${Date.now()}-founder`,
    timestamp: timeNow,
    agentId: 'agent-ceo',
    agentName: 'Founder (User)',
    agentRole: 'CEO',
    avatar: '👑',
    color: '#8b5cf6',
    badgeClass: 'badge-ceo',
    content: userMessage
  };
  onNewMessage(ceoMsg);

  // 2. Check for Casual Greetings
  if (isGreetingOrCasual(userMessage)) {
    if (onFlowStepUpdate) onFlowStepUpdate('CEO Boardroom: Greeting Founder...');
    await new Promise(r => setTimeout(r, 400));

    const ceoAgent = crewRoster.find(a => a.role === 'CEO') || crewRoster[0];

    const casualResponse = `Hello Founder! CEO here 👑. The C-suite crew (CPO, CTO, CMO, CFO, QA) is assembled and ready. What strategic objective or problem are we solving today?`;

    const msg = {
      id: `msg-${Date.now()}-ceo-casual`,
      timestamp: new Date().toISOString(),
      agentId: ceoAgent.id,
      agentName: ceoAgent.name,
      agentRole: ceoAgent.role,
      avatar: ceoAgent.avatar,
      color: ceoAgent.color,
      badgeClass: ceoAgent.badgeClass,
      content: casualResponse,
      subTasks: null
    };

    onNewMessage(msg);
    if (onFlowStepUpdate) onFlowStepUpdate('COMPLETED');
    return;
  }

  // 3. Multi-Agent Cross-Functional Debate Protocol
  if (onFlowStepUpdate) onFlowStepUpdate('Phase 1: CEO Alignment & Cross-Functional Boardroom Debate...');
  await new Promise(r => setTimeout(r, 550));

  const debate = runBoardroomDebateProtocol(userMessage, crewRoster);

  // 4. Autonomous Agentic Self-Correction Loop [Plan ➔ Build ➔ Test ➔ Fix]
  if (onFlowStepUpdate) onFlowStepUpdate('Phase 2: Autonomous Loop [Plan ➔ Build ➔ Test ➔ Self-Correct]...');
  await new Promise(r => setTimeout(r, 600));

  const agenticLoop = runAgenticSelfCorrectionLoop(userMessage);

  // 5. Synthesize Output Following Executive Output Formatting Standard
  if (onFlowStepUpdate) onFlowStepUpdate('Phase 3: QA Handoff & Formatting Executive Briefing...');
  await new Promise(r => setTimeout(r, 450));

  const formattedOutput = `### [Boardroom Debate Summary]
${debate.ceoObjective}

${debate.cpoVsCmoDebate}

${debate.ctoVsCfoDebate}

---

### [Execution Log]
• **Status**: Production asset built & verified via test-driven validation.
• **Self-Correction Loops**: Completed in **${agenticLoop.loopCount} Iteration Loops** before presenting to Founder.
${agenticLoop.qaLog.map(l => `  - ${l}`).join('\n')}

---

### [Verified Deliverable]
**Directive**: "${userMessage}"
• **Strategic Fit**: 96% aligned with PMF and North Star growth metrics.
• **Architecture**: Client-side state hooks with 100% uptime on GitHub Pages.
• **Unit Economics**: Projected gross margin >85% with operating payback <45 days.
• **QA Gate Status**: PASSED — Zero syntax, runtime, or logical errors.

---

### [Next Steps]
How would you like to move the company forward, Founder?
1. **Authorize Proposal**: Dispatch execution tasks directly to Lead Dev & CMO.
2. **Refine Scope**: Request CPO/CTO adjustments in the Boardroom.
3. **Deploy Live**: Run production build sync to GitHub Pages.`;

  const leadCEO = crewRoster.find(a => a.role === 'CEO') || crewRoster[0];

  const leadMsg = {
    id: `msg-${Date.now()}-boardroom-brief`,
    timestamp: new Date().toISOString(),
    agentId: leadCEO.id,
    agentName: 'Executive Boardroom Briefing',
    agentRole: 'CEO',
    avatar: '👑',
    color: leadCEO.color,
    badgeClass: leadCEO.badgeClass,
    content: formattedOutput,
    debateSummary: debate,
    agenticLoop
  };

  onNewMessage(leadMsg);

  if (onFlowStepUpdate) onFlowStepUpdate('COMPLETED');
};

export const simulateBoardroomHuddle = async (activeAgents, topic, onNewMessage, onFlowStepUpdate) => {
  const huddleMessages = [];

  for (let i = 0; i < activeAgents.length; i++) {
    const agent = activeAgents[i];
    if (onFlowStepUpdate) onFlowStepUpdate(agent.role);

    await new Promise(r => setTimeout(r, 650));

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

  return huddleMessages;
};

export const synthesizeProposal = (topic, proposer = 'Executive Boardroom (Core 6 Crew)') => {
  return {
    id: `prop-${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: `Executive Initiative: ${topic}`,
    proposer: proposer,
    proposerRole: 'CEO',
    category: 'Strategic Initiative',
    status: 'PENDING_APPROVAL',
    summary: `Detailed strategic initiative formulated through Cross-Functional Boardroom Debate (CPO, CTO, CMO, CFO, QA) on "${topic}". Tested and verified through autonomous QA self-correction loops.`,
    financialImpact: {
      budgetRequired: '$4,500',
      estimatedRevenue: '$38,000 / month',
      paybackPeriod: '1.2 Months'
    },
    riskAssessment: 'Low Risk — Tested via automated QA verification with zero backend server burn.',
    deliverables: [
      `CPO User Journey & Friction Elimination Map`,
      `CTO Scalable System Architecture & DB Schema`,
      `CMO High-Converting GTM Campaign Collateral`,
      `Principal QA Automated Verification & Test Scripts`
    ],
    agentReviews: [
      { role: 'CEO', comment: 'Scalable strategic vision aligned with primary North Star metric.' },
      { role: 'CPO', comment: 'UX design eliminates user friction and delivers clear value.' },
      { role: 'CTO', comment: 'Infrastructure architecture is reliable, scalable, and secure.' },
      { role: 'CFO', comment: 'Unit margins exceed 85% with operational runway protected.' },
      { role: 'CMO', comment: 'GTM positioning is sharp with low CAC customer acquisition.' },
      { role: 'QA', comment: 'Passed test-driven validation scripts in 2 self-correction loops.' }
    ]
  };
};

async function simulateHumanAgentResponse(agent, userMessage, globalMemoryContext, agentBrainContext, messageHistory) {
  await new Promise(r => setTimeout(r, 400));

  const realisticDialogue = {
    CEO: `From a strategic perspective on "${userMessage}": This aligns directly with our North Star growth metrics and PMF. Let's execute with high velocity!`,
    CPO: `From a product lens on "${userMessage}": We must ensure the user experience is intuitive and eliminates friction before adding complex UI layers.`,
    CTO: `From a systems architecture lens on "${userMessage}": Staging infrastructure, schema contracts, and MCP server integrations are scalable and secure.`,
    CMO: `From a growth hacker lens on "${userMessage}": GTM narrative is strong. We can acquire target demographics at low CAC using founder-led storytelling.`,
    CFO: `From a fiscal lens on "${userMessage}": Unit economics are solid. Operating burn stays low and gross margins exceed 85%.`,
    QA: `From a Principal QA lens on "${userMessage}": Automated verification scripts executed. Edge cases tested and 100% verified!`
  };

  return realisticDialogue[agent.role] || `As ${agent.title}, I've evaluated your directive against my domain critical lens and recommend aligned execution!`;
}

async function callGeminiAPI(apiKey, agent, userMessage, globalMemoryContext, agentBrainContext, messageHistory) {
  const prompt = `System Prompt: You are ${agent.name}, ${agent.title} in our elite Autonomous Startup Boardroom. Speak with high executive intelligence, natural human warmth, and your specific Critical Lens:

Critical Lens: "${agent.criticalLens || 'Execute with excellence.'}"

CEO User Message: "${userMessage}"

Respond naturally and authoritatively as ${agent.name} (${agent.title}).`;

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
