/**
 * COO Liaison & Closed-Loop QA Service for CrewOS
 * Manages CEO requirement clarification, sub-task bifurcation by Aria Vance,
 * GitHub Projects tracking, and QA sub-task re-assignment loops.
 */

import { createGitHubIssue } from './githubService';

/**
 * Evaluates whether a CEO directive requires clarifying questions before dispatching to Aria Vance & Team
 * Orion Vance speaks with warm executive humor and human presence!
 */
export const evaluateCEOIntentAndClarify = (directiveText) => {
  const t = directiveText.trim();
  const lower = t.toLowerCase();

  // If prompt is vague or under 22 chars without specific details, ask clarifying questions warmly
  if (t.length < 22 && !lower.includes('approve') && !lower.includes('hello') && !lower.includes('hi') && !lower.includes('coffee') && !lower.includes('how')) {
    return {
      needsClarification: true,
      questions: [
        `What's our primary target outcome or deadline for "${t}"?`,
        `Any specific budget boundaries or tech preferences you want us to lock in?`
      ],
      cooBrief: `CEO tossed over "${t}". Getting quick clarification before setting Aria and the team loose!`
    };
  }

  return {
    needsClarification: false,
    cooBrief: `CEO directive validated: "${t}". Transmitting refined brief to Aria Vance (CSO) for sub-task bifurcation.`
  };
};

/**
 * Bifurcates a high-level approved initiative into granular sub-tasks (Aria Vance CSO Function)
 */
export const bifurcateDirectiveIntoSubTasks = (initiativeTitle, summary) => {
  const baseId = `subtask-${Date.now()}`;

  return [
    {
      id: `${baseId}-1`,
      parentInitiative: initiativeTitle,
      title: `System Architecture & Database Schema`,
      assigneeRole: 'CTO',
      assigneeName: 'Marcus Sterling',
      badgeClass: 'badge-cto',
      description: `Architect modular client-side hooks, state persistence, and GitHub REST API integration for ${initiativeTitle}.`,
      status: 'IN_PROGRESS',
      qaAudit: null,
      githubIssueUrl: null
    },
    {
      id: `${baseId}-2`,
      parentInitiative: initiativeTitle,
      title: `Financial Budget & ROI Projections`,
      assigneeRole: 'CFO',
      assigneeName: 'Dominic Croft',
      badgeClass: 'badge-cfo',
      description: `Calculate operating burn, gross margin metrics, and 60-day ROI payback schedule for ${initiativeTitle}.`,
      status: 'IN_PROGRESS',
      qaAudit: null,
      githubIssueUrl: null
    },
    {
      id: `${baseId}-3`,
      parentInitiative: initiativeTitle,
      title: `GTM Launch Strategy & Product Positioning`,
      assigneeRole: 'CMO',
      assigneeName: 'Elena Rostova',
      badgeClass: 'badge-cmo',
      description: `Draft viral launch copy, social proof assets, and customer acquisition campaigns for ${initiativeTitle}.`,
      status: 'IN_PROGRESS',
      qaAudit: null,
      githubIssueUrl: null
    },
    {
      id: `${baseId}-4`,
      parentInitiative: initiativeTitle,
      title: `Production Code Components & GitHub Tickets`,
      assigneeRole: 'DEV',
      assigneeName: 'Devin Cole',
      badgeClass: 'badge-dev',
      description: `Build reactive UI components, component contracts, and link GitHub issue tickets for ${initiativeTitle}.`,
      status: 'IN_PROGRESS',
      qaAudit: null,
      githubIssueUrl: null
    }
  ];
};

/**
 * Conducts a Quality Assurance (QA) Audit on a sub-task (Aria Vance CSO Function)
 */
export const auditSubTaskQuality = (subTask, qualityFeedback = '') => {
  const passed = qualityFeedback ? qualityFeedback.includes('GOOD') || qualityFeedback.includes('PASS') : Math.random() > 0.25;

  if (passed) {
    return {
      ...subTask,
      status: 'COMPLETED',
      qaAudit: {
        passed: true,
        feedback: 'QA Audit PASSED: Sub-task satisfies production quality and strategic guidelines.',
        auditedBy: 'Aria Vance (CSO & Quality Director)',
        auditedAt: new Date().toISOString()
      }
    };
  }

  const rejectionReason = qualityFeedback || `Sub-task deliverable requires refinement. Insufficient detail provided for production requirements.`;

  return {
    ...subTask,
    status: 'REASSIGNED_NEEDS_REVISION',
    qaAudit: {
      passed: false,
      feedback: `QA REJECTED by Aria Vance: ${rejectionReason}. Re-assigned to ${subTask.assigneeName} (${subTask.assigneeRole}) for immediate rework.`,
      reassignmentInstructions: `Please revise ${subTask.title} to include complete modular specifications and error handling.`,
      auditedBy: 'Aria Vance (CSO & Quality Director)',
      auditedAt: new Date().toISOString()
    }
  };
};

/**
 * Logs a sub-task to GitHub Projects / Issues API
 */
export const syncSubTaskToGitHubProjects = async (gitHubConfig, subTask) => {
  if (!gitHubConfig.token || !gitHubConfig.repo) {
    return { success: false, message: 'GitHub not configured' };
  }

  try {
    const res = await createGitHubIssue(gitHubConfig, {
      title: `[Sub-Task ${subTask.assigneeRole}] ${subTask.title}`,
      proposalTitle: subTask.parentInitiative,
      assigneeName: subTask.assigneeName,
      assigneeRole: subTask.assigneeRole,
      description: `Sub-task managed by Aria Vance (CSO). Status: ${subTask.status}\n\n${subTask.description}`
    });

    return {
      success: true,
      githubIssueUrl: res.issueUrl,
      issueNumber: res.issueNumber
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
