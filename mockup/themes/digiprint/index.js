const plugin = require("tailwindcss/plugin");
const themeJson = require("./style-guide.json");
const excludedKeys = ["text", "heading", "palette"];

function themePlugin({ addComponents, addUtilities, theme }) {
  const textStyles = {};
  const components = {};

  // Typography from JSON (updated to use new object structure)
  for (const [key, style] of Object.entries(themeJson.fonts.size)) {
    textStyles[`.text-${key}`] = {
      ...(style.fontSize && { fontSize: style.fontSize }),
      ...(style.fontWeight && { fontWeight: style.fontWeight }),
      ...(style.lineHeight && { lineHeight: style.lineHeight }),
      ...(style.letterSpacing && { letterSpacing: style.letterSpacing }),
      ...(style.textTransform && { textTransform: style.textTransform }),
      ...(style.padding && { padding: style.padding }),
    };
  }

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
  components[".btn"] = baseBtn;
  

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

    components[className] = base;
  }

  // Swatch styles (only for visual style guide)
  components[".swatch-box"] = {
    width: "100%",
    aspectRatio: "4 / 3",
    borderRadius: "0.375rem",
    border: "1px solid #ccc",
    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
  };

  components[".swatch-label"] = {
    fontSize: "14px",
    fontFamily: "monospace",
    color: "#4b5563",
    textAlign: "center",
    marginTop: "0.5rem",
  };


  if (themeJson.colors) {
    for (const [name, value] of Object.entries(themeJson.colors)) {
      components[`.bg-${name}`] = {
        backgroundColor: value,
        color: "#ffffff",
        padding: "1rem 1.5rem",
        borderRadius: "0.25rem",
        textAlign: "center"
      };
      components[`.border-${name}`] = { borderColor: value };

      if (name !== "primary") {
        components[`.text-${name}`] = { color: value };
      }

    }

    // Explicit override for text-primary
    components[".text-primary"] = { color: "#333333" };
  }
  

  // Register all components
  addComponents({ ...textStyles, ...components });


}




module.exports = {
  ...themeJson,
  plugin: plugin(themePlugin),
};


