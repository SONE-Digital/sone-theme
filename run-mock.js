const fs = require("fs");
const path = require("path");

const mockupPagesDir = path.resolve(__dirname, "mockup/templates/pages");
const targetPagesDir = path.resolve(__dirname, "src/unified-theme/templates");
const mockupComponentsDir = path.resolve(__dirname, "mockup/templates/components");
const targetPartialsDir = path.resolve(__dirname, "src/unified-theme/templates/partials");

// Site filter - read from mockup config file
let DEPLOY_SITE = "lexjet"; // Default
try {
  const siteConfigPath = path.resolve(__dirname, "mockup/.site-config");
  if (fs.existsSync(siteConfigPath)) {
    DEPLOY_SITE = fs.readFileSync(siteConfigPath, "utf8").trim();
  }
} catch (err) {
  console.warn("⚠️ Could not read site config, using default:", DEPLOY_SITE);
}

// Extract base site name (remove -sandbox suffix for template filtering)
const BASE_SITE = DEPLOY_SITE.replace('-sandbox', '');
console.log(`🎯 Deploying templates for site: ${DEPLOY_SITE} (base: ${BASE_SITE})`);


console.log("📌 Running from:", process.cwd());
console.log("🔍 Source directory:", mockupPagesDir);
console.log("📂 Target directory:", targetPagesDir);

// Utility: Convert file name to Label
function toLabel(fileName) {
  return fileName
    .replace(/\.html$/, "")
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function replaceAssetPaths(content, isComponent = false) {
  if (isComponent) {
    // For components becoming partials: use ../../images/ for partials to reach unified-theme/images/
    return content.replace(
      /(?<=\s(?:src|href)=["'])(\/src\/unified-theme\/images\/[^"']+|\.\.\/(?:\.\.\/)?(?:\.\.\/src\/unified-theme\/)?(?:images\/|assets\/)?[^"']+)(?=["'])/g,
      (match) => {
        // Handle absolute paths from mockup
        if (match.startsWith('/src/unified-theme/images/')) {
          return `{{ get_asset_url('../../images/${match.replace('/src/unified-theme/images/', '')}') }}`;
        }
        // Handle centralized image paths
        let correctedPath = match.replace('../../../src/unified-theme/images/', '../../images/');
        // Handle legacy paths  
        correctedPath = correctedPath.replace('../../assets/', '../../');
        correctedPath = correctedPath.replace('../assets/', '../../');
        correctedPath = correctedPath.replace('../../images/', '../../images/');
        correctedPath = correctedPath.replace(/^\.\.\/images\//, '../../images/');
        return `{{ get_asset_url('${correctedPath}') }}`;
      }
    );
  } else {
    // For templates: convert centralized paths to ../images/ 
    return content.replace(
      /(?<=\s(?:src|href)=["'])(\/src\/unified-theme\/images\/[^"']+|\.\.\/(?:\.\.\/)?(?:\.\.\/src\/unified-theme\/)?(?:images\/|assets\/)?[^"']+)(?=["'])/g,
      (match) => {
        // Handle absolute paths from mockup
        if (match.startsWith('/src/unified-theme/images/')) {
          return `{{ get_asset_url('../images/${match.replace('/src/unified-theme/images/', '')}') }}`;
        }
        // Handle centralized image paths
        let correctedPath = match.replace('../../../src/unified-theme/images/', '../images/');
        // Handle legacy paths
        correctedPath = correctedPath.replace('../../assets/', '../');
        correctedPath = correctedPath.replace('../assets/', '../');
        correctedPath = correctedPath.replace('../../images/', '../images/');
        correctedPath = correctedPath.replace('../images/', '../images/');
        return `{{ get_asset_url('${correctedPath}') }}`;
      }
    );
  }
}

function includeComponents(content) {
  const componentsDir = path.resolve(__dirname, "mockup/templates/components");
  
  // Replace <!--#include virtual="path/to/component.html" --> with actual component content
  return content.replace(/<!--#include\s+virtual=["']([^"']+)["']\s*-->/g, (match, componentPath) => {
    try {
      const fullComponentPath = path.join(componentsDir, componentPath);
      if (fs.existsSync(fullComponentPath)) {
        return fs.readFileSync(fullComponentPath, "utf8");
      } else {
        console.warn(`⚠️ Component not found: ${fullComponentPath}`);
        return `<!-- Component not found: ${componentPath} -->`;
      }
    } catch (err) {
      console.warn(`⚠️ Error loading component ${componentPath}:`, err.message);
      return `<!-- Error loading component: ${componentPath} -->`;
    }
  });
}

function replaceComponents(content) {
  // Replace component tags with HubL includes
  content = content.replace(/<!-- COMPONENT:header -->[\s\S]*?<!-- \/COMPONENT:header -->/g, 
    '{% include "./partials/header.hubl.html" %}');
  
  content = content.replace(/<!-- COMPONENT:footer -->[\s\S]*?<!-- \/COMPONENT:footer -->/g, 
    '{% include "./partials/footer.hubl.html" %}');
  
  return content;
}


function wrapWithHubSpotBlocks(content, label, themeName, isAvailable = true) {
  const newHeader = `<!--
  templateType: page
  isAvailableForNewContent: ${isAvailable}
  label: ${label}
-->

{% extends "./layouts/${themeName}.hubl.html" %}

{% block body %}
`;

  const newFooter = `{% endblock %}`;

  const bodyOpenRegex = /^.*?<body[^>]*>/is;
  const bodyCloseRegex = /<\/body>[\s\S]*$/i;

  let updated = content.replace(bodyOpenRegex, newHeader);
  updated = updated.replace(bodyCloseRegex, newFooter);

  return updated;
}

function syncComponents() {
  console.log("🔄 Syncing components from mockup to partials...");
  
  if (!fs.existsSync(mockupComponentsDir)) {
    console.warn("⚠️ Mockup components directory does not exist:", mockupComponentsDir);
    return;
  }

  // Ensure target partials directory exists
  fs.mkdirSync(targetPartialsDir, { recursive: true });

  const componentFiles = fs.readdirSync(mockupComponentsDir).filter(f => f.endsWith(".html"));
  
  const componentMapping = {
    "header.html": "header.hubl.html",
    "footer.html": "footer.hubl.html"
  };

  for (const componentFile of componentFiles) {
    const targetFileName = componentMapping[componentFile];
    if (!targetFileName) {
      console.log(`⏭ Skipping unmapped component: ${componentFile}`);
      continue;
    }

    const sourcePath = path.join(mockupComponentsDir, componentFile);
    const targetPath = path.join(targetPartialsDir, targetFileName);

    try {
      let content = fs.readFileSync(sourcePath, "utf8");
      
      // Replace asset paths for HubSpot (components become partials)
      content = replaceAssetPaths(content, true);
      
      // Read existing partial to preserve HubSpot header
      let existingContent = "";
      if (fs.existsSync(targetPath)) {
        existingContent = fs.readFileSync(targetPath, "utf8");
      }

      // Extract HubSpot header from existing file
      const hubspotHeaderMatch = existingContent.match(/^<!--[\s\S]*?-->[\s\S]*?{#.*?#}/m);
      let hubspotHeader = "";
      
      if (hubspotHeaderMatch) {
        hubspotHeader = hubspotHeaderMatch[0] + "\n\n{# Partial #}\n\n";
      } else {
        // Default header for new partials
        const templateType = targetFileName === "header.hubl.html" ? "Website header" : "Website footer";
        hubspotHeader = `<!--
  templateType: global_partial
  label: ${templateType}
-->

{# Partial variables #}

{% set template_translations = load_translations('../_locales', html_lang, 'en') %}
{% import "../../helpers/variables.hubl.html" %}

{# Partial #}

`;
      }

      // Combine header with component content
      const finalContent = hubspotHeader + content;
      
      fs.writeFileSync(targetPath, finalContent, "utf8");
      console.log(`✔ Synced component: ${componentFile} → ${targetFileName}`);
      
    } catch (err) {
      console.error(`❌ Error syncing component ${componentFile}:`, err.message);
    }
  }
}


// Ensure target directory exists
if (!fs.existsSync(mockupPagesDir)) {
  console.error("❌ Source directory does not exist.");
  process.exit(1);
}
fs.mkdirSync(targetPagesDir, { recursive: true });

// Process all .html files
const files = fs.readdirSync(mockupPagesDir).filter(f => f.endsWith(".html"));
console.log(`📄 Found ${files.length} HTML file(s):`, files);

for (const file of files) {
  const inputPath = path.join(mockupPagesDir, file);
  const outputPath = path.join(targetPagesDir, file.replace('.html', '.hubl.html'));

  try {
    let content = fs.readFileSync(inputPath, "utf8");

    if (content.trimStart().startsWith("<!--")) {
      console.log(`⏭ Skipped (starts with comment): ${file}`);
      continue;
    }

    const label = toLabel(file);
    const fileNameParts = file.split("-");
    const potentialSitePrefix = fileNameParts[0].toLowerCase();
    
    // Check if this is a site-specific template
    const isSiteSpecific = fileNameParts.length > 1 && ["lexjet", "digiprint", "hp", "kodak"].includes(potentialSitePrefix);
    const isForCurrentSite = !isSiteSpecific || potentialSitePrefix === BASE_SITE;
    
    content = replaceComponents(content);
    content = replaceAssetPaths(content);
    
    if (isForCurrentSite) {
      // Template is for current site or shared - make it available
      content = wrapWithHubSpotBlocks(content, label, potentialSitePrefix, true);
      console.log(`✔ Processed (${isSiteSpecific ? 'site-specific' : 'shared'}): ${file}`);
    } else {
      // Template is for a different site - hide it
      content = wrapWithHubSpotBlocks(content, label, potentialSitePrefix, false);
      console.log(`✔ Processed (hidden for ${BASE_SITE}): ${file}`);
    }

    fs.writeFileSync(outputPath, content, "utf8");
  } catch (err) {
    console.error(`❌ Error processing ${file}:`, err.message);
  }
}

// Sync components to partials
syncComponents();

// Images will be stored only in src/unified-theme/images and referenced from there
console.log("📁 Using centralized images from src/unified-theme/images");

// Sync CSS from mockup to vite-dist
console.log("🎨 Syncing CSS from mockup to vite-dist...");
const mockupCssDir = path.resolve(__dirname, "mockup/assets/css");
const viteCssDir = path.resolve(__dirname, "src/unified-theme/assets/vite-dist/css");

// Get all CSS files in mockup
const cssFiles = fs.readdirSync(mockupCssDir).filter(f => f.endsWith('.css'));

for (const cssFile of cssFiles) {
  const mockupCssPath = path.join(mockupCssDir, cssFile);
  const viteCssPath = path.join(viteCssDir, cssFile.replace('.css', '.hubl.css'));
  
  try {
    const cssContent = fs.readFileSync(mockupCssPath, "utf8");
    fs.writeFileSync(viteCssPath, cssContent, "utf8");
    console.log(`✔ Synced CSS: mockup/assets/css/${cssFile} → vite-dist/css/${path.basename(viteCssPath)}`);
  } catch (err) {
    console.error(`❌ Error syncing CSS ${cssFile}:`, err.message);
  }
}
