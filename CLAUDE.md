# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **S-One Universal Theme** - a multi-site HubSpot CMS theme built on the foundation of HubSpot's Elevate theme framework. Originally based on the [HubSpot CMS Elevate Theme](https://github.com/HubSpot/cms-elevate-theme-public), this theme has been enhanced to support multiple brands and deployment strategies.

**Repository**: https://github.com/SONE-Digital/sone-hubspot-theme.git

### Multi-Site Architecture

The theme supports multiple brands with:
- **LexJet**: Primary brand configuration
- **DigiPrint**: Secondary brand with custom layouts
- **HP**: Brand-specific templates and styling
- **Kodak**: Dedicated brand implementation

**Branch Strategy**: Each brand gets its own deployment branch (lexjet, digiprint, hp, kodak) for targeted updates.

### Project Structure - Live vs Mockup

**Live Project**: The main S-One project (`src/unified-theme/`) - the actual HubSpot theme that runs in production
**Mockup Project**: The `mockup/` directory - a static HTML testing environment for developing and previewing pages before deployment

#### Mockup to Live Deployment Process
1. **Mockup Development**: Build and test pages as static HTML in the `mockup/` directory
2. **Mockup Server**: Use `npm run run-mockup` to build mockup and serve at http://127.0.0.1:3001 for testing
3. **Deploy to Live**: When ready, `run-mock.js` (in main project root) converts mockup HTML files to HubSpot HubL templates
4. **Template Conversion**: The script processes templates in `mockup/templates/pages/` and converts them to HubSpot-compatible files in `src/unified-theme/templates/`

## Key Development Commands

### Installation & Setup
```bash
# Install dependencies for all workspaces
npm run npm-install:all
# or with yarn
yarn yarn-install:all
```

### Development

#### Mockup Development (Static HTML Testing)
```bash
# Build mockup and serve at http://127.0.0.1:3001
cd mockup && npm run run-mockup

# Alternative: Just serve existing mockup files
cd mockup && npm run serve

# Build mockup only (no server)
cd mockup && npm run build-mockup
```

#### Live Project Development (HubSpot Theme)
```bash
# Start the HubSpot development server (from theme directory)
npm run npm-start    # or npm run yarn-start
cd src/unified-theme && npm run start    # direct command
```

### Building & Deployment

#### Mockup to Live Deployment
```bash
# Convert mockup HTML to HubSpot templates (run from main project root)
npm run mock

# Complete deployment: convert mockup → commit → push
npm run deploy-project
```

#### Live Project Building & Upload
```bash
# Build the live theme
npm run build

# Upload to HubSpot
npm run upload

# Build and upload in one command
npm run build-upload
```

### Testing & Quality
```bash
# Run tests
npm test
npm run test-verbose

# Linting and formatting
npm run lint:js
npm run prettier

# Mock server for development
npm run mock
```

## Architecture Overview

### Project Structure
- **Root level**: Contains main build configuration, Vite setup, and project scripts
- **src/unified-theme/**: The actual theme implementation
  - **components/**: React components organized by type
    - **modules/**: Theme modules (Accordion, Button, Card, ImageAndText, etc.)
    - **fieldLibrary/**: Reusable field components
    - **utils/**: Utility functions and helpers
    - **types/**: TypeScript type definitions
  - **templates/**: HubL templates
  - **assets/**: CSS, images, and other static assets
  - **sections/**: Theme sections
  - **helpers/**: Helper functions

### Technology Stack
- **Vite**: Build tool and development server
- **TypeScript**: Type checking and enhanced development experience
- **React 18**: Component framework
- **Styled Components**: CSS-in-JS styling
- **HubSpot CMS Components**: Official HubSpot React components
- **PostCSS**: CSS processing with HubL support
- **Vitest**: Testing framework with jsdom environment
- **Storybook**: Component development and documentation

### Module Pattern
Each theme module follows this structure:
- `index.tsx`: Main component implementation with TypeScript types
- `fields.js`: Module field definitions for HubSpot
- `meta`: Module metadata including label, content types, icon, and categories
- Uses styled-components for styling with CSS custom properties
- Implements proper TypeScript typing for HubSpot field types

### Build System
- **Vite Config**: Custom configuration for HubL CSS processing
- **PostCSS**: Handles HubL parsing and CSS processing
- **Output**: Built files go to `src/unified-theme/assets/vite-dist/`
- **CSS**: Processes multiple entry points (main, templates-specific stylesheets)

### CSS Framework Usage
- **Blog Templates**: Use Bootstrap for styling
- **All Other Pages**: Use Tailwind CSS framework
- This dual framework approach maintains consistency with existing blog infrastructure while leveraging Tailwind for new page development

## Development Patterns

### Component Development
- Use TypeScript for all components with proper field type definitions
- Follow the existing styled-components pattern for styling
- Use HubSpot CMS Components where appropriate (@hubspot/cms-components)
- Implement proper CSS custom properties for theming
- Include StyledComponentsRegistry wrapper for proper SSR support

### Testing
- Tests run from project root but resolve React from unified-theme directory
- Uses jsdom environment for React component testing
- Vitest configuration includes proper alias resolution for styled-components

### HubSpot Integration
- HubSpot CLI configured in hubspot.config.yml
- Project uses unified theme framework (hsproject.json)
- Theme configuration in src/unified-theme/theme.json
- Field definitions in src/unified-theme/fields.json

## Important Notes

- **Dual Development Environment**: Mockup for static HTML testing, Live for HubSpot integration
- **Mockup Server**: Always runs on http://127.0.0.1:3001 via `npm run run-mockup`
- **Template Conversion**: `run-mock.js` converts mockup HTML to HubSpot HubL templates
- **Deployment Flow**: Mockup → Test → Deploy to Live → Upload to HubSpot
- The project uses a dual package.json setup (root + theme directory + mockup directory)
- Development server must be started from the unified-theme directory for live theme work
- Build outputs are processed through custom HubL PostCSS cleaner
- Theme extends HubSpot's module system with custom React components
- Uses HubSpot's project-based theme framework, not design manager themes

### CRITICAL: Theme Version and GitHub Integration
**DO NOT change the theme version without updating GitHub integration in HubSpot!**

The theme version is defined in TWO locations and MUST match for GitHub integration:
1. `hsproject.json` - "name" field (e.g., "S-One Theme 2025.02")
2. `src/unified-theme/theme.json` - "label" field (must match hsproject.json)

**Current version**: S-One Theme 2025.03

**If you need to create a new version:**
- Update BOTH files with the same version number
- The GitHub repository integration in HubSpot is linked to the project name
- If you change the version, HubSpot will show: `Couldn't link your GitHub repository to your project. Make sure the 'name' field in your hsproject.json matches your 'projectName'`
- To fix: Either revert to the original version OR manually update the GitHub integration in HubSpot UI
- **Recommended**: Keep version 2025.02 unless explicitly creating a new major release

## Recent Session History & Critical Context

### Multi-Site Template Filtering System
The `run-mock.js` script includes site-specific filtering logic:
```javascript
const DEPLOY_SITE = process.env.DEPLOY_SITE || "lexjet";
const isSiteSpecific = fileNameParts.length > 1 && ["lexjet", "digiprint", "hp", "kodak"].includes(potentialSitePrefix);
const isForCurrentSite = !isSiteSpecific || potentialSitePrefix === DEPLOY_SITE;
```
This ensures only relevant templates are visible to each brand deployment.

### React Module Creation Pattern
React modules follow this strict export pattern (based on existing Button module):
```javascript
// Component implementation
export const Component = (props) => { /* React component */ };

// Required exports for HubSpot
export { fields } from './fields.js';
export const meta = {
  label: 'Module Name',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: 'IconName',
  categories: ['category'],
};
export const defaultModuleConfig = {
  moduleName: 'sone/components/modules/ModuleName',
  version: 0,
  themeModule: true,
};
```

### LexJet Brand Implementation Status
**Completed Components**:
- **LexJetHeader1**: React module with inline styles, proper exports, located at `src/unified-theme/components/modules/LexJetHeader1/`
- **LexJetFooter1**: React module with inline styles, proper exports, located at `src/unified-theme/components/modules/LexJetFooter1/`
- **lexjet-starter.hubl.html**: Drag-and-drop template with header/footer/content sections
- **Site-specific layouts**: `digiprint.hubl.html` layout created for brand-specific styling

**Image Path Resolution**: Fixed mockup image paths from `../../images/` to `../images/` in `run-mockup.js`

**CSS Sync Issues Resolved**: Updated `run-mock.js` to sync all brand CSS files instead of just lexjet

### Known Issues & Troubleshooting
1. **Module Registration Errors**: HubSpot may show "Unable to find module" errors for new React components
   - Solution: Run `cd src/unified-theme && npm run generate-tmp-json-for-translations` to generate field JSON files
   - Ensure all modules have proper `fields.js`, `meta`, and `defaultModuleConfig` exports

2. **Template Visibility**: Templates with brand prefixes (e.g., `lexjet-starter`) only appear for that specific brand deployment
   - Controlled by `DEPLOY_SITE` environment variable in `run-mock.js`

3. **Asset Path Issues**: Different path requirements between mockup (relative) and live (HubSpot asset URLs)
   - Mockup uses: `../images/filename.png`
   - Live uses: `{{ get_asset_url('../images/filename.png') }}`

### Critical Deployment Notes
- **Always deploy from mockup package.json**: User specified to use `cd mockup && npm run deploy-project`
- **Site-specific layouts required**: Each brand needs its own layout file for proper CSS loading
- **Branch-based deployment**: Each brand deploys to its own branch (lexjet, digiprint, etc.)

### Field Generation Process
For new React modules, the field generation process requires:
1. Create `fields.js` file (can be empty: `export const fields = [];`)
2. Ensure proper module exports (Component, fields, meta, defaultModuleConfig)
3. Run `npm run generate-tmp-json-for-translations` from unified-theme directory
4. This creates the necessary JSON field definitions for HubSpot recognition

### Last Session Work Summary (2025-10-08)
Created NBWA Specials page and deployed S-One Theme 2025.02 to live LexJet portal.

#### NBWA Specials Page
1. **Created**: `mockup/templates/pages/lexjet-nbwa-specials.html`
   - NBWA Show Specials content with vendor sections (Canon, Epson, EFI, HP, IntoPrint, Mimaki, LexJet Media)
   - Styled to match capital equipment page (simple sections without cards)
   - Font Awesome 6.5.0 checkmark bullets (`fa-circle-check`) for all list items
   - Absolute image paths: `/src/unified-theme/images/lexjet/...`
2. **Updated**: `mockup/index.html` to include link to new NBWA page
3. **Deployed**: Successfully pushed to GitHub lexjet branch

#### S-One Theme 2025.02 Deployment
1. **Version Created**: Updated both `theme.json` and `hsproject.json` to version 2025.02
2. **Upload Issue Resolved**: HubSpot upload was failing with "Unable to deserialize `/unified-theme/`" error
   - **Root Cause**: Invalid `"author"` field in theme.json (must be object, not string)
   - **Solution**: Removed author field and set `preview_path` to empty string (matching version 2025.01)
3. **Successfully Deployed**: Build #4 succeeded and deployed to live LexJet portal (portalId: 4826009)
   - View: https://app.hubspot.com/developer-projects/4826009/project/S-One%20Theme%202025.02/

#### Key Lessons Learned
- **theme.json author field**: Must be object with `name`, `email`, `url` properties, not a simple string
- **theme.json preview_path**: Can be empty string if no specific preview template needed
- **Simple theme.json works**: Minimal configuration (label, preview_path, screenshot_path, modules) is sufficient
- **Git credentials**: Windows Credential Manager can cache wrong GitHub account credentials
- **Theme versioning**: Both `theme.json` label and `hsproject.json` name must match for proper deployment

#### Theme Configuration Files Updated
- `src/unified-theme/theme.json`: Version 2025.02, removed invalid author field, empty preview_path
- `hsproject.json`: Name updated to "S-One Theme 2025.02"
- `hubspot.config.yml`: defaultPortal set to "lexjet" (production)

## Configuration Files
- `vite.config.ts`: Main build configuration with HubL support
- `vitest.config.ts`: Test configuration with proper React resolution
- `hubspot.config.yml`: HubSpot CLI configuration
- `src/unified-theme/tsconfig.json`: TypeScript configuration for theme components
- `run-mock.js`: Mockup to HubSpot template conversion with multi-site filtering
- `mockup/run-mockup.js`: Mockup development server with path conversion
- `hsproject.json`: HubSpot project configuration for unified theme framework

## File Locations Reference
- **React Modules**: `src/unified-theme/components/modules/[ModuleName]/`
- **Templates**: `src/unified-theme/templates/` (converted from `mockup/templates/pages/`)
- **Layouts**: `src/unified-theme/templates/layouts/[brand].hubl.html`
- **CSS**: `mockup/assets/css/[brand]-theme.css` → synced to live project
- **Images**: `mockup/images/` → `src/unified-theme/images/`
- **Mockup Server**: Always at http://127.0.0.1:3001 via `cd mockup && npm run run-mockup`