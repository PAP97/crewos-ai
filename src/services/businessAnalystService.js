/**
 * Business Analyst & Company Feasibility Service for CrewOS
 * Powered by Aria Vance (Lead BA) and Orion Vance (COO).
 * Features Dynamic Multi-Sprint Generation (1 to 6+ Sprints based on complexity),
 * Company Prerequisites Analysis, and Iterative QA Rework Loops.
 */

import { createGitHubIssue } from './githubService';

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

  if (titleLower.includes('architecture') || titleLower.includes('website') || titleLower.includes('app') || titleLower.includes('enterprise')) {
    devSpace = 'Isolated Staging Space + Multi-Tenant REST API Endpoint Sandbox';
    testTools = 'Automated E2E Unit Test Suite + Multi-Browser Pen-Testing Audit';
    if (titleLower.includes('blockchain') || titleLower.includes('mobile app') || titleLower.includes('ai cluster') || titleLower.includes('enterprise website')) {
      hiringNeeds = 'Hire 1 external Senior DevOps & Pen-Testing Contractor';
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
    summary: `Company analysis complete: Prerequisites identified for dev space, testing tools, and talent requirements. ${hiringAlert ? 'External contractor hiring recommended for specialized roles.' : 'Core team fully equipped for execution.'}`
  };
};

/**
 * Dynamically bifurcates a project into 1 to 6+ Agile Sprints based on project scale and complexity!
 * Aria Vance (Lead Business Analyst Function)
 */
export const bifurcateProjectIntoAgileSprints = (directiveTitle, summary = '') => {
  const baseId = `sprint-${Date.now()}`;
  const titleLower = directiveTitle.toLowerCase();

  // Determine dynamic sprint count based on scope
  let targetSprintCount = 3; // Default medium

  const isHugeEnterprise = titleLower.includes('architecture') || titleLower.includes('website') || titleLower.includes('enterprise') || titleLower.includes('platform') || titleLower.includes('system');
  const isSimple = titleLower.length < 25 && !isHugeEnterprise;

  if (isHugeEnterprise) {
    targetSprintCount = 6; // Huge multi-sprint project
  } else if (isSimple) {
    targetSprintCount = 2; // Lean feature sprint
  } else {
    targetSprintCount = 4; // Standard initiative
  }

  const sprints = [];

  // Sprint 1: Prerequisites & System Architecture
  sprints.push({
    sprintNumber: 1,
    sprintName: 'Sprint 1: Space Prerequisites & Architecture Design',
    duration: '1 Week',
    subTasks: [
      {
        id: `${baseId}-s1-1`,
        sprint: 1,
        title: 'Infrastructure Staging Space & REST API Hooks',
        assigneeRole: 'CTO',
        assigneeName: 'Marcus Sterling',
        badgeClass: 'badge-cto',
        userStory: 'As CTO, establish dev/staging environment and GitHub REST API integration for continuous testing.',
        status: 'COMPLETED',
        qaIterationCount: 1,
        qaAudit: { passed: true, feedback: 'QA PASSED: Staging sandbox verified with zero latency.', auditedBy: 'Aria Vance (Lead BA)' }
      },
      {
        id: `${baseId}-s1-2`,
        sprint: 1,
        title: 'Capital Allocation & Contractor Budgeting',
        assigneeRole: 'CFO',
        assigneeName: 'Dominic Croft',
        badgeClass: 'badge-cfo',
        userStory: 'As CFO, model payback schedule and allocate contractor budget if external hiring is triggered.',
        status: 'COMPLETED',
        qaIterationCount: 1,
        qaAudit: { passed: true, feedback: 'QA PASSED: Operating burn under control.', auditedBy: 'Aria Vance (Lead BA)' }
      }
    ]
  });

  // Sprint 2: Core Data Schema & State Management (If Medium/Huge)
  if (targetSprintCount >= 2) {
    sprints.push({
      sprintNumber: 2,
      sprintName: 'Sprint 2: Data Schemas & Core Backend Contracts',
      duration: '1 Week',
      subTasks: [
        {
          id: `${baseId}-s2-1`,
          sprint: 2,
          title: 'Database Schema & State Persistence Layer',
          assigneeRole: 'DEV',
          assigneeName: 'Devin Cole',
          badgeClass: 'badge-dev',
          userStory: 'As Lead Dev, define database schemas, client state hooks, and error boundaries.',
          status: 'QA_REJECTED_NEEDS_REWORK',
          qaIterationCount: 2,
          qaAudit: {
            passed: false,
            feedback: 'QA REJECTED by Aria Vance (BA): Initial component contract lacked boundary fallback handlers. Sent back for rework.',
            reassignmentInstructions: 'Add error boundary wrappers and loading states before re-submitting.',
            auditedBy: 'Aria Vance (Lead BA)'
          }
        }
      ]
    });
  }

  // Sprint 3: Component Engineering & UI Contracts
  if (targetSprintCount >= 3) {
    sprints.push({
      sprintNumber: 3,
      sprintName: 'Sprint 3: Component Engineering & GTM Campaign Copy',
      duration: '2 Weeks',
      subTasks: [
        {
          id: `${baseId}-s3-1`,
          sprint: 3,
          title: 'Reactive UI Component Contracts',
          assigneeRole: 'DEV',
          assigneeName: 'Devin Cole',
          badgeClass: 'badge-dev',
          userStory: 'As Lead Dev, build responsive UI components aligned with design tokens.',
          status: 'IN_PROGRESS',
          qaIterationCount: 1,
          qaAudit: null
        },
        {
          id: `${baseId}-s3-2`,
          sprint: 3,
          title: 'GTM Positioning & Launch Copy Assets',
          assigneeRole: 'CMO',
          assigneeName: 'Elena Rostova',
          badgeClass: 'badge-cmo',
          userStory: 'As CMO, draft viral brand launch stories and customer acquisition copy.',
          status: 'COMPLETED',
          qaIterationCount: 1,
          qaAudit: { passed: true, feedback: 'QA PASSED: GTM story sharp.', auditedBy: 'Aria Vance (Lead BA)' }
        }
      ]
    });
  }

  // Sprint 4: Security Audit & Pen-Testing (If 4+ Sprints)
  if (targetSprintCount >= 4) {
    sprints.push({
      sprintNumber: 4,
      sprintName: 'Sprint 4: Security Audit & Pen-Testing Sandbox',
      duration: '1 Week',
      subTasks: [
        {
          id: `${baseId}-s4-1`,
          sprint: 4,
          title: 'Security Gate & API Authentication Test',
          assigneeRole: 'CTO',
          assigneeName: 'Marcus Sterling',
          badgeClass: 'badge-cto',
          userStory: 'As CTO, perform security penetration audit and verify encrypted session storage.',
          status: 'IN_PROGRESS',
          qaIterationCount: 1,
          qaAudit: null
        }
      ]
    });
  }

  // Sprint 5: E2E Integration & Staging Sandboxing (If 5+ Sprints)
  if (targetSprintCount >= 5) {
    sprints.push({
      sprintNumber: 5,
      sprintName: 'Sprint 5: Staging E2E Sandbox & Integration Testing',
      duration: '1 Week',
      subTasks: [
        {
          id: `${baseId}-s5-1`,
          sprint: 5,
          title: 'End-to-End User Flow & Integration Verification',
          assigneeRole: 'DEV',
          assigneeName: 'Devin Cole',
          badgeClass: 'badge-dev',
          userStory: 'As Lead Dev, run automated E2E user flow tests across browser engines.',
          status: 'IN_PROGRESS',
          qaIterationCount: 1,
          qaAudit: null
        }
      ]
    });
  }

  // Sprint 6: Production Release & Telemetry (If 6+ Sprints)
  if (targetSprintCount >= 6) {
    sprints.push({
      sprintNumber: 6,
      sprintName: 'Sprint 6: Live Production Release & GitHub Telemetry',
      duration: '1 Week',
      subTasks: [
        {
          id: `${baseId}-s6-1`,
          sprint: 6,
          title: 'Production Bundle Deployment & Telemetry',
          assigneeRole: 'CTO',
          assigneeName: 'Marcus Sterling',
          badgeClass: 'badge-cto',
          userStory: 'As CTO, deploy production build to GitHub Pages and initialize telemetry metrics.',
          status: 'IN_PROGRESS',
          qaIterationCount: 1,
          qaAudit: null
        }
      ]
    });
  }

  return sprints;
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
