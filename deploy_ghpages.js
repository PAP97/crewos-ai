import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

try {
  const token = fs.readFileSync('PAT_Key.txt', 'utf8').trim();
  const remoteUrl = `https://${token}@github.com/PAP97/crewos-ai.git`;

  console.log('1. Building production assets with Vite...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('2. Syncing source codebase to main branch...');
  execSync('git add .', { stdio: 'inherit' });
  try {
    execSync('git commit -m "Sync source codebase to main"', { stdio: 'inherit' });
  } catch (e) {}
  execSync('git push origin main --force', { stdio: 'inherit' });
  console.log('✅ Main branch synced successfully!');

  console.log('3. Deploying ONLY dist folder contents to gh-pages branch...');
  const distDir = path.resolve('dist');

  // Remove existing .git in dist if any
  const distGit = path.join(distDir, '.git');
  if (fs.existsSync(distGit)) {
    fs.rmSync(distGit, { recursive: true, force: true });
  }

  // Initialize fresh git inside dist folder
  execSync('git init', { cwd: distDir, stdio: 'inherit' });
  execSync('git config user.name "PAP97"', { cwd: distDir, stdio: 'inherit' });
  execSync('git config user.email "pap97@github.com"', { cwd: distDir, stdio: 'inherit' });
  execSync('git add -A', { cwd: distDir, stdio: 'inherit' });
  execSync('git commit -m "Production Build Deployment"', { cwd: distDir, stdio: 'inherit' });
  execSync('git branch -M gh-pages', { cwd: distDir, stdio: 'inherit' });
  execSync(`git remote add origin ${remoteUrl}`, { cwd: distDir, stdio: 'inherit' });
  execSync('git push -f origin gh-pages', { cwd: distDir, stdio: 'inherit' });

  console.log('🚀 LIVE GITHUB PAGES DEPLOYED SUCCESSFULLY TO ROOT OF GH-PAGES!');

} catch (err) {
  console.error('Deployment error:', err.message);
}
