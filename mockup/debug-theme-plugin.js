const path = require("path");
const plugin = require("tailwindcss/plugin");

// Load your theme plugin (e.g., themes/lexjet/index.js)
const theme = require("./themes/lexjet/index.js");

// Mock Tailwind plugin context
const context = {
  addComponents: (components) => {
    console.log("🔍 Components generated:");
    console.dir(components, { depth: null });
  },
  addUtilities: (utilities) => {
    console.log("🔧 Utilities generated:");
    console.dir(utilities, { depth: null });
  },
  addBase: (base) => {
    console.log("🎨 Base styles generated:");
    console.dir(base, { depth: null });
  },
  addVariant: (variantName, definition) => {
    console.log(`🎛️ Variant added: ${variantName}`);
    console.dir(definition, { depth: null });
  }
};

// Run the plugin manually
if (typeof theme.plugin === "function") {
  theme.plugin(context); // plugin exported directly
} else if (theme.plugin && typeof theme.plugin.handler === "function") {
  theme.plugin.handler(context); // plugin wrapped via tailwindcss/plugin()
} else {
  console.error("❌ Could not find plugin function in theme.");
}
