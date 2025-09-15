const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read site config
let DEPLOY_SITE = "lexjet"; // Default
try {
  const siteConfigPath = path.resolve(__dirname, "mockup/.site-config");
  if (fs.existsSync(siteConfigPath)) {
    DEPLOY_SITE = fs.readFileSync(siteConfigPath, "utf8").trim();
  }
} catch (err) {
  console.warn("⚠️ Could not read site config, using default:", DEPLOY_SITE);
}

// Determine target branch based on site config
let targetBranch;
if (DEPLOY_SITE.includes('-sandbox')) {
  // For sandbox sites, use the site name as branch name
  targetBranch = DEPLOY_SITE;
} else {
  // For production sites, use just the site name
  targetBranch = DEPLOY_SITE;
}

console.log(`🎯 Site: ${DEPLOY_SITE}`);
console.log(`🌿 Target branch: ${targetBranch}`);

try {
  // Get current branch
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  console.log(`📍 Current branch: ${currentBranch}`);

  // Stage all changes
  console.log('📦 Staging changes...');
  execSync('git add .', { stdio: 'inherit' });

  // Commit changes
  console.log('💾 Committing changes...');
  execSync('git commit -m "*"', { stdio: 'inherit' });

  // Switch to target branch if different from current
  if (currentBranch !== targetBranch) {
    console.log(`🔄 Switching to branch: ${targetBranch}`);

    // Check if target branch exists locally
    let branchExists = false;
    try {
      execSync(`git show-ref --verify --quiet refs/heads/${targetBranch}`);
      branchExists = true;
    } catch (err) {
      // Branch doesn't exist locally
    }

    if (branchExists) {
      execSync(`git checkout ${targetBranch}`, { stdio: 'inherit' });
      execSync(`git merge ${currentBranch}`, { stdio: 'inherit' });
    } else {
      // Create new branch from current branch
      execSync(`git checkout -b ${targetBranch}`, { stdio: 'inherit' });
    }
  }

  // Push to remote
  console.log(`🚀 Pushing to origin/${targetBranch}...`);
  execSync(`git push -u origin ${targetBranch}`, { stdio: 'inherit' });

  console.log(`✅ Successfully deployed to branch: ${targetBranch}`);

} catch (err) {
  console.error('❌ Deployment failed:', err.message);
  process.exit(1);
}