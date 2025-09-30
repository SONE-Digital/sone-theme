const themeName = process.env.THEME || "widget-world";
const themeJson = require(`./themes/${themeName}/style-guide.json`);

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./templates/pages/**/*.html",
    "./themes/**/*.{js,jsx,ts,tsx,html}",
    "./style-guide.html"
  ],
  safelist: [
    { pattern: /^text-h\d{1,2}$/ },
    { pattern: /^bg-(primary|secondary|success|warning|danger|info)$/ },
    { pattern: /^text-(primary|secondary|success|warning|danger|info|text|heading)$/ },
    'btn', 'btn-primary', 'btn-secondary', 'btn-link', 'swatch-box', 'swatch-label'
  ],
  theme: {
    extend: {
      brand: '#8BBA09',
      colors: {
        primary: themeJson.colors?.primary || '#002855',
        secondary: themeJson.colors?.secondary || '#007BFF',
        success: themeJson.colors?.success || '#44B44F', 
        warning: themeJson.colors?.warning || '#FFC107',
        danger: themeJson.colors?.danger || '#B12704',
        info: themeJson.colors?.info || '#5B6574',
      },
      fontFamily: themeJson.fonts?.family,
      fontWeight: themeJson.fonts?.weight,
      borderRadius: themeJson.borderRadius,
      boxShadow: themeJson.boxShadow,
      screens: {
        'xs': '475px',
      },
      spacing: {
        '4': '1rem',
        '8': '2rem',
        '16': '4rem',
        '24': '6rem',
        '28': '7rem',
        '30': '7.5rem',
        '40': '10rem',
        '48': '12rem',
        '64': '16rem',
      },
      fontSize: (() => {
        const customFontSizes = {};

        // Handle different theme JSON structures
        if (themeJson.fonts && themeJson.fonts.size) {
          // Old format with fonts.size
          for (const [key, style] of Object.entries(themeJson.fonts.size)) {
            if (style.fontSize) {
              if (typeof style.fontSize === 'object') {
                customFontSizes[key] = style.fontSize.default;
              } else {
                customFontSizes[key] = style.fontSize;
              }
            }
          }
        } else if (themeJson.typography) {
          // New format with typography
          if (themeJson.typography.bodySize) {
            customFontSizes.body = themeJson.typography.bodySize;
          }
          if (themeJson.typography.headingSizes) {
            themeJson.typography.headingSizes.forEach((size, index) => {
              customFontSizes[`h${index + 1}`] = size;
            });
          }
        }
        return customFontSizes;
      })(),
    }
  },
  plugins: [
    // Only include plugin if it exists
    ...((() => {
      try {
        const themeModule = require(`./themes/${themeName}/index.js`);
        return themeModule.plugin ? [themeModule.plugin] : [];
      } catch (e) {
        return [];
      }
    })())
  ],
};