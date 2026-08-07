/**
 * GitHub Integration Service for CrewOS
 * Enables storing crew memory, session logs, creating GitHub Issues/Tickets, and deployment sync.
 */

export const loadGitHubConfig = () => {
  try {
    const saved = localStorage.getItem('crewos_github_config');
    return saved ? JSON.parse(saved) : { token: '', repo: 'PAP97/crewos-ai', branch: 'main', autoSync: true };
  } catch (e) {
    return { token: '', repo: 'PAP97/crewos-ai', branch: 'main', autoSync: true };
  }
};

export const saveGitHubConfig = (config) => {
  let cleanRepo = config.repo.trim();
  cleanRepo = cleanRepo.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');

  const finalConfig = { ...config, repo: cleanRepo };
  localStorage.setItem('crewos_github_config', JSON.stringify(finalConfig));
  return finalConfig;
};

export const testGitHubConnection = async (config) => {
  let cleanRepo = (config.repo || 'PAP97/crewos-ai').trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');

  if (!config.token || !cleanRepo) {
    throw new Error('Please provide both a GitHub Personal Access Token and Repository (e.g. username/repository).');
  }

  const response = await fetch(`https://api.github.com/repos/${cleanRepo}`, {
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to connect to GitHub repo (${response.status})`);
  }

  const repoData = await response.json();
  return {
    success: true,
    fullName: repoData.full_name,
    defaultBranch: repoData.default_branch,
    isPrivate: repoData.private,
    htmlUrl: repoData.html_url
  };
};

/**
 * Creates a GitHub Issue / Ticket for a Crew Task
 */
export const createGitHubIssue = async (config, task) => {
  if (!config.token || !config.repo) {
    throw new Error('GitHub connection not configured.');
  }

  const cleanRepo = config.repo.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
  const url = `https://api.github.com/repos/${cleanRepo}/issues`;

  const issueBody = `## 📋 CrewOS Executive Directive Ticket

**Assignee Crew Member:** ${task.assigneeName} (${task.assigneeRole})  
**Authorized by:** CEO (User)  
**Parent Initiative:** ${task.proposalTitle}  
**Status:** Approved & Active Execution  

### 📝 Description
${task.description || 'No additional description provided.'}

${task.codeContent ? `### 💻 Generated Artifact Spec\n\`\`\`javascript\n${task.codeContent}\n\`\`\`` : ''}

---
*Created automatically by [CrewOS AI Platform](https://github.com/${cleanRepo})*`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: `[${task.assigneeRole}] ${task.title}`,
      body: issueBody,
      labels: ['crewos-ticket', task.assigneeRole.toLowerCase()]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create GitHub issue');
  }

  const issueData = await response.json();
  return {
    success: true,
    issueNumber: issueData.number,
    issueUrl: issueData.html_url,
    title: issueData.title
  };
};

/**
 * Sync shared memory JSON file to GitHub repo
 */
export const syncMemoryToGitHub = async (config, memoryData) => {
  if (!config.token || !config.repo) return { success: false, message: 'GitHub connection not configured' };

  const cleanRepo = config.repo.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
  const filePath = 'crew_memory.json';
  const url = `https://api.github.com/repos/${cleanRepo}/contents/${filePath}`;
  const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(memoryData, null, 2))));

  let sha = null;
  try {
    const getRes = await fetch(url + `?ref=${config.branch || 'main'}`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }
  } catch (e) {
    console.log('File does not exist yet on GitHub, creating new file...');
  }

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `[CrewOS Auto-Sync] Update shared memory bank - ${new Date().toISOString()}`,
      content: contentBase64,
      branch: config.branch || 'main',
      ...(sha ? { sha } : {})
    })
  });

  if (!putRes.ok) {
    const err = await putRes.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to push memory to GitHub');
  }

  const resData = await putRes.json();
  return {
    success: true,
    commitUrl: resData.commit.html_url,
    timestamp: new Date().toISOString()
  };
};
