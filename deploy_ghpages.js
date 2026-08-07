import { execSync } from 'child_process';
import fs from 'fs';

try {
  const token = fs.readFileSync('PAT_Key.txt', 'utf8').trim();
  const remoteUrl = `https://${token}@github.com/PAP97/crewos-ai.git`;

  console.log('Staging and committing any remaining files...');
  execSync('git add .', { stdio: 'inherit' });
  
  try {
    execSync('git commit -m "Sync final codebase and deployment scripts to GitHub"', { stdio: 'inherit' });
  } catch (e) {
    console.log('Working tree clean.');
  }

  console.log('Pushing all commits to GitHub main branch...');
  execSync(`git push origin main --force`, { stdio: 'inherit' });
  console.log('✅ All code successfully pushed to main branch!');

  console.log('Deploying dist build to gh-pages branch...');
  execSync('git add dist -f', { stdio: 'inherit' });
  try {
    execSync('git commit -m "Deploy production build to gh-pages"', { stdio: 'inherit' });
  } catch (e) {}
  
  execSync(`git push origin main:gh-pages --force`, { stdio: 'inherit' });
  console.log('🚀 Live GitHub Pages deployed successfully!');

} catch (err) {
  console.error('Push log:', err.message);
}
