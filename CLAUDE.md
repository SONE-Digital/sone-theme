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

### Last Session Work Summary
The most recent work involved fixing the broken blog templates:

#### Blog Template Issues & Resolution
1. **Problem**: Mixed CSS frameworks (Tailwind + Bootstrap/HubSpot Elevate) caused CSS conflicts and broken layouts
2. **Initial Attempts**: Tried to make custom blog templates work with Elevate classes but created more conflicts
3. **Final Solution**: Completely reset to original HubSpot CMS Elevate theme blog templates

#### Blog Template Restoration Process
1. **Deleted broken files**: Removed all custom blog templates and CSS modifications
2. **Downloaded originals**: Pulled fresh templates from https://github.com/HubSpot/cms-elevate-theme-public
   - `blog-listing.hubl.html` - Original drag-and-drop blog listing template
   - `blog-detail.hubl.html` - Original blog post detail template
   - `blog.hubl.css` - Original HubSpot Elevate blog CSS
3. **Minimal fixes applied**:
   - Fixed CSS path in blog-detail.hubl.html: `../../assets/dist/css/blog.hubl.css` → `../../assets/vite-dist/css/blog.hubl.css`
   - Added `{% set template_css = "../../assets/vite-dist/css/blog.hubl.css" %}` to blog-listing.hubl.html
4. **Deployed successfully**: Original HubSpot templates now working with proper Elevate theme styling

#### Key Lessons Learned
- **Don't mix CSS frameworks**: Tailwind + Bootstrap/HubSpot Elevate creates conflicts
- **Use original templates as base**: HubSpot Elevate templates are well-designed, modify minimally
- **CSS path consistency**: Ensure template_css paths match your build system (vite-dist vs dist)
- **Header/Footer integration**: Base layout handles header/footer properly, don't override unless necessary

### Current Blog Status
- **Blog listing**: Uses original HubSpot drag-and-drop template with BlogListing module
- **Blog detail**: Uses original HubSpot blog post template with proper meta, comments, etc.
- **CSS**: Original HubSpot Elevate blog styling (no custom modifications)
- **Layout**: Extends base.hubl.html (not lexjet.hubl.html) to avoid Tailwind conflicts

### Next Steps (if session continues)
- Test blog functionality in HubSpot
- If customization needed, modify the BlogListing React component instead of the template
- For styling changes, modify blog.hubl.css cautiously to avoid breaking existing structure

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