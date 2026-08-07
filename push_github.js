import { execSync } from 'child_process';
import fs from 'fs';

try {
  const token = fs.readFileSync('PAT_Key.txt', 'utf8').trim();
  console.log('Initializing git repository...');
  
  execSync('git init', { stdio: 'inherit' });
  execSync('git config user.name "PAP97"', { stdio: 'inherit' });
  execSync('git config user.email "pap97@github.com"', { stdio: 'inherit' });
  execSync('git add .', { stdio: 'inherit' });
  
  try {
    execSync('git commit -m "Initial commit: CrewOS AI Executive Platform with CEO Governance and GitHub Memory Sync"', { stdio: 'inherit' });
  } catch (e) {
    console.log('Nothing to commit or already committed.');
  }

  execSync('git branch -M main', { stdio: 'inherit' });
  
  const remoteUrl = `https://${token}@github.com/PAP97/crewos-ai.git`;
  try {
    execSync(`git remote add origin ${remoteUrl}`, { stdio: 'inherit' });
  } catch (e) {
    execSync(`git remote set-url origin ${remoteUrl}`, { stdio: 'inherit' });
  }

  console.log('Pushing main branch to GitHub repository PAP97/crewos-ai...');
  execSync('git push -u origin main --force', { stdio: 'inherit' });
  console.log('✅ Main branch pushed successfully to https://github.com/PAP97/crewos-ai');

  // Push dist folder to gh-pages branch for live web deployment!
  console.log('Deploying dist build to gh-pages branch...');
  execSync('git subtree push --prefix dist origin gh-pages', { stdio: 'inherit' });
  console.log('🚀 Live GitHub Pages deployed successfully!');

} catch (err) {
  console.error('Error during push/deploy:', err.message);
}
