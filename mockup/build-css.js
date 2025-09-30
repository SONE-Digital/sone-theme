const fs = require("fs");
const { execSync } = require("child_process");

// Read site configuration
let SITE = "widget-world"; // Default
try {
  const siteConfigPath = ".site-config";
  if (fs.existsSync(siteConfigPath)) {
    SITE = fs.readFileSync(siteConfigPath, "utf8").trim();
  }
} catch (err) {
  console.warn("⚠️ Could not read site config, using default:", SITE);
}

console.log(`🎨 Building CSS for site: ${SITE}`);

// Build site-specific CSS with theme environment variable
const outputFile = `./assets/css/${SITE}-theme.css`;
try {
  execSync(`npx tailwindcss -o ${outputFile}`, {
    stdio: 'inherit',
    env: { ...process.env, THEME: SITE }
  });
  console.log(`✅ CSS built: ${outputFile}`);
} catch (err) {
  console.error(`❌ CSS build failed:`, err.message);
  process.exit(1);
}