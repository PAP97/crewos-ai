/**
 * Business Analyst & Company Feasibility Service for CrewOS
 * Powered by Aria Vance (Lead BA) and Orion Vance (COO).
 * Manages Company Prerequisites Analysis, Agile Sprint Bifurcation,
 * and Iterative To-and-Fro Build/Test/Rework QA Loops.
 */

/**
 * Analyzes Company Feasibility & Prerequisites for major directives
 * (Space, Testing Environment, Tooling, External Hiring Needs)
 */
export const analyzeCompanyFeasibilityAndPrerequisites = (directiveTitle) => {
  const titleLower = directiveTitle.toLowerCase();

  let devSpace = 'Vite + React Client-Side Workspace (100% Client Persistence)';
  let testTools = 'Automated Vite Build Pipeline + Chrome DevTools MCP Audit';
  let hiringNeeds = 'No external hiring needed — Core C-suite crew (CTO, CFO, CMO, DEV) fully capable.';
  let hiringAlert = false;

  if (titleLower.includes('architecture') || titleLower.includes('website') || titleLower.includes('app')) {
    devSpace = 'Isolated Staging Environment + GitHub REST API Endpoint Persistence';
    testTools = 'Automated E2E Unit Test Suite + Multi-Browser Simulation';
    if (titleLower.includes('blockchain') || titleLower.includes('mobile app') || titleLower.includes('ai cluster')) {
      hiringNeeds = 'Hire 1 external Specialist Contractor (Senior Security / DevOps Engineer)';
      hiringAlert = true;
    }
  }

  return {
    directiveTitle,
    analyzedAt: new Date().toISOString(),
    prerequisites: [
      { category: 'Development & Test Space', detail: devSpace, status: 'READY' },
      { category: 'Testing & QA Tooling', detail: testTools, status: 'READY' },
      { category: 'Team Talent & Capability', detail: hiringNeeds, alert: hiringAlert, status: hiringAlert ? 'ACTION_REQUIRED' : 'READY' }
    ],
    summary: `Company analysis complete: Prerequisites identified for dev space, testing tools, and talent requirements. ${hiringAlert ? 'External hiring required for specialized roles.' : 'Core team fully equipped for execution.'}`
  };
};

/**
 * Bifurcates a complex project into Agile Sprints (Aria Vance Lead Business Analyst Function)
 */
export const bifurcateProjectIntoAgileSprints = (directiveTitle, summary) => {
  const baseId = `sprint-${Date.now()}`;

  return [
    {
      sprintNumber: 1,
      sprintName: 'Sprint 1: Prerequisites & System Architecture',
      duration: '1 Week',
      subTasks: [
        {
          id: `${baseId}-s1-1`,
          sprint: 1,
          title: 'Infrastructure & Staging Space Setup',
          assigneeRole: 'CTO',
          assigneeName: 'Marcus Sterling',
          badgeClass: 'badge-cto',
          userStory: 'As a CTO, set up staging environment and GitHub REST API integration so code can be tested continuously.',
          status: 'COMPLETED',
          qaIterationCount: 1,
          qaAudit: { passed: true, feedback: 'QA PASSED: Staging environment verified with zero latency.', auditedBy: 'Aria Vance (Lead BA)' }
        },
        {
          id: `${baseId}-s1-2`,
          title: 'Capital Budget & Resource Allocation',
          assigneeRole: 'CFO',
          assigneeName: 'Dominic Croft',
          badgeClass: 'badge-cfo',
          userStory: 'As a CFO, allocate budget for cloud tools and verify 60-day payback metrics.',
          status: 'COMPLETED',
          qaIterationCount: 1,
          qaAudit: { passed: true, feedback: 'QA PASSED: Operating burn under budget.', auditedBy: 'Aria Vance (Lead BA)' }
        }
      ]
    },
    {
      sprintNumber: 2,
      sprintName: 'Sprint 2: Core Engineering & Feature Development',
      duration: '2 Weeks',
      subTasks: [
        {
          id: `${baseId}-s2-1`,
          sprint: 2,
          title: 'Modular Code Components & State Persistence',
          assigneeRole: 'DEV',
          assigneeName: 'Devin Cole',
          badgeClass: 'badge-dev',
          userStory: 'As Lead Dev, build reactive UI component contracts and state persistence hooks.',
          status: 'QA_REJECTED_NEEDS_REWORK',
          qaIterationCount: 2,
          qaAudit: {
            passed: false,
            feedback: 'QA REJECTED by Aria Vance (BA): Initial component lacked error boundary handling. Sent back for rework.',
            reassignmentInstructions: 'Add error boundary wrappers and loading states before re-submitting.',
            auditedBy: 'Aria Vance (Lead BA)'
          }
        },
        {
          id: `${baseId}-s2-2`,
          sprint: 2,
          title: 'Product Positioning & Campaign Launch Copy',
          assigneeRole: 'CMO',
          assigneeName: 'Elena Rostova',
          badgeClass: 'badge-cmo',
          userStory: 'As CMO, draft viral GTM copy and brand messaging.',
          status: 'COMPLETED',
          qaIterationCount: 1,
          qaAudit: { passed: true, feedback: 'QA PASSED: GTM story sharp.', auditedBy: 'Aria Vance (Lead BA)' }
        }
      ]
    },
    {
      sprintNumber: 3,
      sprintName: 'Sprint 3: Full Integration, QA Audit & Production Release',
      duration: '1 Week',
      subTasks: [
        {
          id: `${baseId}-s3-1`,
          sprint: 3,
          title: 'End-to-End Penetration Test & Production Deployment',
          assigneeRole: 'CTO',
          assigneeName: 'Marcus Sterling',
          badgeClass: 'badge-cto',
          userStory: 'As CTO & Lead Dev, run production build verification and deploy live to GitHub Pages.',
          status: 'IN_PROGRESS',
          qaIterationCount: 1,
          qaAudit: null
        }
      ]
    }
  ];
};

/**
 * Manages iterative to-and-fro QA rework for sprint sub-tasks
 */
export const executeIterativeQAReworkLoop = (subTask, reworkFeedback = '') => {
  const currentIteration = (subTask.qaIterationCount || 1) + 1;
  const isApproved = reworkFeedback ? (reworkFeedback.includes('PASS') || reworkFeedback.includes('GOOD')) : true;

  if (isApproved) {
    return {
      ...subTask,
      status: 'COMPLETED',
      qaIterationCount: currentIteration,
      qaAudit: {
        passed: true,
        feedback: `QA Audit PASSED on Iteration #${currentIteration}: Rework completed successfully. Production ready!`,
        auditedBy: 'Aria Vance (Lead BA & Quality Director)',
        auditedAt: new Date().toISOString()
      }
    };
  }

  return {
    ...subTask,
    status: 'QA_REJECTED_NEEDS_REWORK',
    qaIterationCount: currentIteration,
    qaAudit: {
      passed: false,
      feedback: `QA REJECTED on Iteration #${currentIteration}: ${reworkFeedback || 'Requires additional refinement.'}`,
      reassignmentInstructions: `Re-assigned to ${subTask.assigneeName} (${subTask.assigneeRole}) for Iteration #${currentIteration + 1}.`,
      auditedBy: 'Aria Vance (Lead BA & Quality Director)',
      auditedAt: new Date().toISOString()
    }
  };
};
