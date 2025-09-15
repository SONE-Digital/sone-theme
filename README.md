# S-One Universal Theme - HubSpot CMS Multi-Site Theme

S-One Universal Theme is a multi-site HubSpot CMS theme built on the foundation of HubSpot's Elevate theme. Originally based on the [HubSpot CMS Elevate Theme](https://github.com/HubSpot/cms-elevate-theme-public), this theme has been enhanced to support multiple brands and deployment strategies while maintaining modern development practices.

## Overview

The S-One Universal Theme provides a flexible, multi-brand solution for HubSpot CMS, utilizing:
- **Multi-Site Architecture**: Support for multiple brands (LexJet, DigiPrint, HP, Kodak) with shared and site-specific components
- **Dual Development Environment**: Static HTML mockup for testing + live HubSpot theme deployment
- **Branch-Based Deployment**: Each brand gets its own deployment branch for targeted updates
- **Modern Development Stack**: Vite, TypeScript, React 18, Styled Components
- **Template Conversion Pipeline**: Automated conversion from mockup HTML to HubSpot HubL templates

## Prerequisites

- [Node.js](https://nodejs.org) (version specified in `.node-version`)
- [HubSpot CLI](https://developers.hubspot.com/docs/cms/developer-reference/local-development-cli)

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/SONE-Digital/sone-hubspot-theme.git
   cd sone-hubspot-theme
   ```

2. Install dependencies for all workspaces:
   ```bash
   npm run npm-install:all
   # or
   yarn yarn-install:all
   ```

3. Configure your HubSpot CLI (if not already configured):
   ```bash
   hs init
   ```

## Development Workflow

### Mockup Development (Recommended for Initial Development)

The mockup environment allows you to develop and test pages as static HTML before deploying to HubSpot:

1. **Start mockup development server:**
   ```bash
   cd mockup
   npm run run-mockup
   ```
   This builds the mockup and serves it at http://127.0.0.1:3000

2. **Test your changes** in the mockup environment first

3. **Deploy to live theme** when ready:
   ```bash
   # From project root
   npm run mock
   ```

### Live Theme Development

For direct HubSpot theme development:

1. **Start the HubSpot development server:**
   ```bash
   cd src/sone-theme
   npm run start
   ```

2. **Build and upload:**
   ```bash
   npm run build-upload
   # or separately:
   npm run build
   npm run upload
   ```

## Multi-Site Configuration

### Supported Brands
- **LexJet**: Primary brand configuration
- **DigiPrint**: Secondary brand with custom layouts
- **HP**: Brand-specific templates and styling
- **Kodak**: Dedicated brand implementation

### Site-Specific Development

Each brand can have:
- **Shared templates**: No prefix (available to all sites)
- **Brand-specific templates**: Prefixed with brand name (e.g., `lexjet-starter.hubl.html`)
- **Custom CSS**: Brand-specific styling in `assets/css/`
- **Unique layouts**: Site-specific layout files

### Deployment Strategy

The theme uses a branch-based deployment strategy:
- **lexjet branch**: LexJet brand deployment
- **digiprint branch**: DigiPrint brand deployment
- **hp branch**: HP brand deployment
- **kodak branch**: Kodak brand deployment

## Available Scripts

### Root Level Scripts
- `build` - Builds the theme for production
- `upload` - Uploads the theme to HubSpot
- `build-upload` - Builds and uploads the theme in one command
- `mock` - Converts mockup HTML to HubSpot templates
- `deploy-project` - Full deployment pipeline (convert → commit → push)
- `npm-install:all` - Installs dependencies for all workspaces
- `npm-start` / `yarn-start` - Starts development server

### Mockup Scripts
- `run-mockup` - Builds mockup and serves at http://127.0.0.1:3000
- `build-mockup` - Builds mockup files only
- `serve` - Serves existing mockup files

## Project Structure

```
├── mockup/                     # Static HTML testing environment
│   ├── templates/pages/        # Mockup HTML templates
│   ├── assets/css/             # Brand-specific CSS files
│   └── package.json            # Mockup development scripts
├── src/
│   └── sone-theme/             # Main HubSpot theme directory
│       ├── components/         # React components
│       │   ├── modules/        # Theme modules (LexJetHeader1, LexJetFooter1, etc.)
│       │   ├── fieldLibrary/   # Reusable field components
│       │   └── utils/          # Utility helpers
│       ├── templates/          # HubL templates
│       │   ├── layouts/        # Site-specific layouts
│       │   └── pages/          # Page templates
│       ├── assets/             # Built CSS and static assets
│       ├── images/             # Theme images
│       └── package.json        # Theme dependencies
├── run-mock.js                 # Mockup to HubSpot conversion script
├── vite.config.ts              # Vite build configuration
└── hsproject.json              # HubSpot project configuration
```

## Key Features

### Template Conversion Pipeline
The `run-mock.js` script automatically converts mockup HTML files to HubSpot-compatible HubL templates, including:
- Path conversion for HubSpot asset URLs
- HubL block wrapping for drag-and-drop functionality
- Site-specific template filtering
- CSS synchronization between environments

### Multi-Brand Support
- **Site Filtering**: Only relevant templates are visible to each brand
- **Custom Layouts**: Each brand can have its own layout and styling
- **Shared Components**: Common modules available across all brands
- **Asset Management**: Organized image and CSS asset structure

### Modern Development Stack
- **Vite**: Fast build tool with HubL processing support
- **TypeScript**: Full type safety for React components
- **Styled Components**: CSS-in-JS with theme support
- **React 18**: Latest React features and performance improvements
- **HubSpot CMS Components**: Official HubSpot React component library

## Creating New Brand Sites

1. **Create brand-specific layout:**
   ```bash
   # Copy existing layout and customize
   cp src/sone-theme/templates/layouts/lexjet.hubl.html src/sone-theme/templates/layouts/[brand].hubl.html
   ```

2. **Add brand CSS:**
   ```bash
   # Create CSS file in mockup
   touch mockup/assets/css/[brand]-theme.css
   ```

3. **Create brand templates:**
   ```bash
   # Use brand prefix for templates
   touch mockup/templates/pages/[brand]-starter.html
   ```

4. **Update deployment configuration:**
   ```bash
   # Set DEPLOY_SITE environment variable
   export DEPLOY_SITE=[brand]
   npm run mock
   ```

## Original Theme Attribution

This theme is based on the [HubSpot CMS Elevate Theme](https://github.com/HubSpot/cms-elevate-theme-public), which is HubSpot's default CMS theme. The original Elevate theme provides:
- Modern development practices with Vite and TypeScript
- Comprehensive React component library
- Built-in testing with Vitest
- HubSpot CMS integration patterns

## Contributing

This is a private theme for S-One Digital clients. For bugs or feature requests, please create issues in the repository or contact the development team directly.

## License

This project builds upon the Apache-2.0 licensed HubSpot Elevate theme. See the LICENSE file for details.

## Support

- **HubSpot CMS Documentation**: [Building with React on HubSpot](https://developers.hubspot.com/docs/guides/cms/react/overview)
- **HubSpot Developer Docs**: [developers.hubspot.com](https://developers.hubspot.com/)
- **HubSpot Community**: [community.hubspot.com](https://community.hubspot.com/)
- **Original Elevate Theme**: [github.com/HubSpot/cms-elevate-theme-public](https://github.com/HubSpot/cms-elevate-theme-public)