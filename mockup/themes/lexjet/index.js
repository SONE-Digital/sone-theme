// themes/lexjet/index.js
const plugin = require("tailwindcss/plugin");
const themeJson = require("./style-guide.json");

function themePlugin({ addComponents, addUtilities, theme }) {
  const responsiveTextUtilities = {}; // Use this to collect breakpoint-specific font sizes
  const baseTextComponents = {};      // Use this for non-responsive properties and the 'default' font size
  const otherComponents = {};         // Renamed 'components' to 'otherComponents' to avoid confusion

  // Typography from JSON
  for (const [key, style] of Object.entries(themeJson.fonts.size)) {
    const componentStyles = {
      ...(style.fontWeight && { fontWeight: style.fontWeight }),
      ...(style.lineHeight && {
        lineHeight: style.lineHeight.important
          ? `${style.lineHeight.value} !important`
          : style.lineHeight,
      }),
      ...(style.letterSpacing && { letterSpacing: style.letterSpacing }),
      ...(style.textTransform && { textTransform: style.textTransform }),
      ...(style.padding && { padding: style.padding }),
    };

    // Handle fontSize:
    if (typeof style.fontSize === 'object') {
      // Apply the 'default' font size directly to the base component style
      componentStyles.fontSize = style.fontSize.default;

      // Iterate through breakpoints for responsive font sizes
      for (const [breakpoint, fontSizeValue] of Object.entries(style.fontSize)) {
        if (breakpoint !== 'default') {
          // Initialize breakpoint object if it doesn't exist
          if (!responsiveTextUtilities[`@screen ${breakpoint}`]) {
            responsiveTextUtilities[`@screen ${breakpoint}`] = {};
          }
          // Assign the font size for the specific breakpoint and class
          responsiveTextUtilities[`@screen ${breakpoint}`][`.text-${key}`] = {
            fontSize: fontSizeValue,
          };
        }
      }
    } else if (style.fontSize) {
      // If fontSize is a single value, apply it directly to the base component style
      componentStyles.fontSize = style.fontSize;
    }

    // Add the base text style component
    baseTextComponents[`.text-${key}`] = componentStyles;
  }

  // --- Buttons and Swatch ---

  // Shared .btn base style (from JSON or fallback)
  const baseBtn = themeJson.buttons?.shared || {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "12px",
    textTransform: "uppercase",
    padding: "0 16px",
    height: "34px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  };
  otherComponents[".btn"] = baseBtn; // Use 'otherComponents' here

  // Button variants from JSON
  for (const [variant, styles] of Object.entries(themeJson.buttons || {})) {
    if (variant === "shared") continue;

    const className = `.btn-${variant}`;
    const hover = styles.hover || {};

    const base = {
      ...(styles.backgroundColor && { backgroundColor: styles.backgroundColor }),
      ...(styles.textColor && { color: styles.textColor }),
      ...(styles.fontWeight && { fontWeight: styles.fontWeight }),
      ...(styles.fontSize && { fontSize: styles.fontSize }),
      ...(styles.lineHeight && { lineHeight: styles.lineHeight }),
      ...(styles.height && { height: styles.height }),
      ...(styles.textTransform && { textTransform: styles.textTransform }),
      ...(styles.padding && { padding: styles.padding }),
      ...(styles.borderRadius && { borderRadius: styles.borderRadius }),
      ...(styles.border && { border: styles.border }),
      ...(styles.textDecoration && { textDecoration: styles.textDecoration }),
      ...(styles.borderBottom && { borderBottom: styles.borderBottom }),
      ...(styles.maxWidth && { maxWidth: styles.maxWidth }),
      ...(styles.whiteSpace && { whiteSpace: styles.whiteSpace }),
      ...(styles.width && { width: styles.width }),

      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
    };

    if (Object.keys(hover).length > 0) {
      base["&:hover"] = {
        ...(hover.backgroundColor && { backgroundColor: hover.backgroundColor }),
        ...(hover.color && { color: hover.color }),
        ...(hover.borderColor && { borderColor: hover.borderColor }),
        ...(hover.borderBottomColor && { borderBottomColor: hover.borderBottomColor }),
        ...(hover.borderBottom && { borderBottom: hover.borderBottom }),
      };
    }

    otherComponents[className] = base; // Use 'otherComponents' here
  }

  // Swatch styles (only for visual style guide)
  otherComponents[".swatch-box"] = { // Use 'otherComponents' here
    width: "100%",
    aspectRatio: "4 / 3",
    borderRadius: "0.375rem",
    border: "1px solid #ccc",
    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
  };

  otherComponents[".swatch-label"] = { // Use 'otherComponents' here
    fontSize: "14px",
    fontFamily: "monospace",
    color: "#4b5563",
    textAlign: "center",
    marginTop: "0.5rem",
  };

  // HubSpot Drag-and-Drop Grid System Fix
  otherComponents[".dnd-section"] = {
    padding: "var(--hsElevate--section--medium__verticalPadding, 40px) var(--hsElevate--section--horizontalPadding, 20px)",
  };
  
  otherComponents[".row-fluid"] = {
    display: "flex !important",
    flexWrap: "nowrap !important",
    width: "100%",
    "@media (min-width: 768px)": {
      flexWrap: "nowrap !important",
      justifyContent: "space-between",
      gap: "20px",
    },
  };

  // Grid column classes for HubSpot drag-and-drop
  const spanClasses = ['.span1', '.span2', '.span3', '.span4', '.span5', '.span6', 
                       '.span7', '.span8', '.span9', '.span10', '.span11', '.span12'];
  
  spanClasses.forEach(span => {
    otherComponents[`.row-fluid ${span}`] = {
      minHeight: "1px",
      width: "100%",
    };
  });

  // Specific responsive column widths
  otherComponents['.row-fluid .span6'] = {
    '@media (min-width: 768px)': {
      width: 'calc(50% - 10px)',
      flex: '0 0 calc(50% - 10px)',
    },
  };
  
  otherComponents['.row-fluid .span4'] = {
    '@media (min-width: 768px)': {
      width: 'calc(33.333% - 13px)',
      flex: '0 0 calc(33.333% - 13px)',
    },
  };
  
  otherComponents['.row-fluid .span3'] = {
    '@media (min-width: 768px)': {
      width: 'calc(25% - 15px)',
      flex: '0 0 calc(25% - 15px)',
    },
  };

  // Generate color utilities from theme colors as components to ensure they're included
  const colorComponents = {};
  for (const [colorName, colorValue] of Object.entries(themeJson.colors)) {
    if (typeof colorValue === 'string') { // Only process string color values, not objects
      // For light colors, use dark text; for dark colors, use white text
      const isLight = ['warning'].includes(colorName); // Add more light colors as needed
      const textColor = isLight ? '#000000' : '#ffffff';
      
      colorComponents[`.bg-${colorName}`] = { 
        backgroundColor: colorValue,
        color: textColor,
        padding: '1rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        borderRadius: '0.375rem'
      };
      colorComponents[`.text-${colorName}`] = { color: colorValue };
      colorComponents[`.border-${colorName}`] = { borderColor: colorValue };
    }
  }

  // Register all components and utilities
  addComponents({ ...baseTextComponents, ...otherComponents, ...colorComponents }); // Include color components
  addUtilities(responsiveTextUtilities); // Add responsive font size utilities
}

module.exports = {
  ...themeJson,
  plugin: plugin(themePlugin),
};