const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'src/unified-theme/assets/dist/css');
const viteDistDir = path.join(__dirname, 'src/unified-theme/assets/vite-dist/css');

console.log('🔄 Syncing CSS from dist to vite-dist...');

// Ensure vite-dist directory exists
if (!fs.existsSync(viteDistDir)) {
  fs.mkdirSync(viteDistDir, { recursive: true });
}

// Get all CSS files from dist
const cssFiles = fs.readdirSync(distDir).filter(file => file.endsWith('.css'));

// Copy each CSS file from dist to vite-dist
cssFiles.forEach(file => {
  const srcPath = path.join(distDir, file);
  const destPath = path.join(viteDistDir, file);

  fs.copyFileSync(srcPath, destPath);
  console.log(`  ✔ Synced: ${file}`);
});

console.log(`✅ Successfully synced ${cssFiles.length} CSS files from dist to vite-dist`);
