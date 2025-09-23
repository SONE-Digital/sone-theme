const fs = require("fs");
const path = require("path");

// Read site configuration
let SITE = "lexjet"; // Default
try {
  const siteConfigPath = path.resolve(__dirname, ".site-config");
  if (fs.existsSync(siteConfigPath)) {
    SITE = fs.readFileSync(siteConfigPath, "utf8").trim();
  }
} catch (err) {
  console.warn("⚠️ Could not read site config, using default:", SITE);
}

// Load theme file (defaults to LexJet if none passed)
const brandFile = process.argv[2] || `./themes/${SITE}/index.js`;
const theme = require(path.resolve(brandFile));



// Read the style guide template
const template = fs.readFileSync(
  path.join(__dirname, "theme-template.html"),
  "utf8"
);

// Generate color palette grid
const colorPaletteHTML = `
<div class="px-8 pt-8 pb-12">
  <h3 class="text-xl font-semibold mb-6 text-center">Color Palette</h3>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
    ${theme.colors.palette
      .map(
        (color) => `
      <div class="flex flex-col items-center space-y-2 w-full">
        <div class="w-full" style="aspect-ratio: 4 / 3; background-color: ${color}; border: 1px solid #ccc; border-radius: 0.375rem;"></div>
        <div class="text-sm font-mono text-gray-800">${color}</div>
      </div>
    `
      )
      .join("")}
  </div>
</div>
`;

// Generate typography section
let typographySection = "";
const fontFamilyDisplay =
  theme.fonts.family?.sans?.[0]?.replace(/^"+|"+$/g, "") || "Sans";

for (const [key, heading] of Object.entries(theme.fonts.size)) {
  const label = heading.label || {};

  // Parse compact padding (if all sides are in one string)
  let paddingDisplay = heading.padding;
  if (typeof paddingDisplay === "string") {
    const parts = paddingDisplay.split(/\s+/);
    if (parts.length === 1) {
      paddingDisplay = `${parts[0]},${parts[0]},${parts[0]},${parts[0]}`;
    } else if (parts.length === 2) {
      paddingDisplay = `${parts[0]},${parts[1]},${parts[0]},${parts[1]}`;
    } else if (parts.length === 3) {
      paddingDisplay = `${parts[0]},${parts[1]},${parts[2]},${parts[1]}`;
    } else if (parts.length === 4) {
      paddingDisplay = parts.join(",");
    }
  }

  typographySection += `
    <div class="space-y-2">
      <div class="grid grid-cols-[150px_1fr] gap-6 items-center">
        <span class="text-primary font-semibold text-sm">
          ${key.toUpperCase()} (${heading.label.fontSize})
        </span>
        <div>
          <div class="text-${key}">
            The quick brown fox jumps over the lazy dog
          </div>
          <div class="text-sm text-gray-500 leading-6">
            ${fontFamilyDisplay} – ${label.fontWeight || heading.fontWeight} – ${heading.fontSize} – Padding (${paddingDisplay}) - Letter Spacing (${heading.letterSpacing}) - Line Height (${heading.lineHeight})
          </div>
        </div>
      </div>
      <hr class="border-gray-200" />
    </div>
  `;
}


// Start building output from the template
let result = template;

// Replace tokens
result = result.replace(/{{\s*theme\.brand\s*}}/g, theme.brand || "Brand");
result = result.replace(/{{\s*colorPaletteGrid\s*}}/g, colorPaletteHTML);
result = result.replace(/{{\s*typographySection\s*}}/g, typographySection);

// Replace CSS path with site-specific file
result = result.replace(/href="[^"]*(?:lexjet|digiprint|hp|kodak)-theme\.css"/, `href="../../assets/css/${SITE}-theme.css"`);

// Function to convert paths for mockup viewing  
function convertPathsForMockup(content) {
  // Handle both old relative paths and new absolute paths
  return content
    .replace(/src="\.\.\/\.\.\/\.\.\/src\/unified-theme\/images\//g, 'src="/src/unified-theme/images/')
    .replace(/src="\/src\/unified-theme\/images\//g, 'src="/src/unified-theme/images/');
}

// Load and replace component placeholders
try {
  // Try to load site-specific components first, fallback to generic ones
  let headerFile = `templates/components/${SITE}-header.html`;
  let footerFile = `templates/components/${SITE}-footer.html`;

  if (!fs.existsSync(path.join(__dirname, headerFile))) {
    headerFile = "templates/components/header.html";
  }
  if (!fs.existsSync(path.join(__dirname, footerFile))) {
    footerFile = "templates/components/footer.html";
  }

  let headerComponent = fs.readFileSync(path.join(__dirname, headerFile), "utf8");
  let footerComponent = fs.readFileSync(path.join(__dirname, footerFile), "utf8");
  
  // Convert paths for mockup viewing
  headerComponent = convertPathsForMockup(headerComponent);
  footerComponent = convertPathsForMockup(footerComponent);
  
  result = result.replace(/{{\s*headerComponent\s*}}/g, `<!-- COMPONENT:header -->
${headerComponent}
            <!-- /COMPONENT:header -->`);
  result = result.replace(/{{\s*footerComponent\s*}}/g, `<!-- COMPONENT:footer -->
${footerComponent}
            <!-- /COMPONENT:footer -->`);
} catch (err) {
  console.warn("⚠️ Could not load components:", err.message);
  result = result.replace(/{{\s*headerComponent\s*}}/g, "<!-- Header component not found -->");
  result = result.replace(/{{\s*footerComponent\s*}}/g, "<!-- Footer component not found -->");
}

// Save final output
const outputFile = `./templates/pages/${SITE}-theme.html`;
fs.writeFileSync(outputFile, result, "utf8");

console.log(`✅ Style guide generated: templates/pages/${SITE}-theme.html`);
