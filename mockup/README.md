# S-One Mockup Development

This directory contains the mockup development environment for the S-One HubSpot theme project.

## What This Is

The mockup directory is a Vite + React development environment that allows you to:
- Build and preview theme mockups locally
- Generate CSS themes using Tailwind
- Convert mockup HTML files to HubSpot templates
- Deploy mockups to HubSpot for testing

## Project Structure Relationship

This mockup system works in conjunction with the main S-One project:

```
S-One Project/
├── mockup/                    # This directory - mockup development
│   ├── assets/css/           # Generated theme CSS files
│   ├── tailwind.css          # Tailwind source
│   └── package.json          # Mockup-specific scripts
├── run-mock.js               # Script to convert mockups to HubSpot templates
└── src/sone-theme/           # Main HubSpot theme (target for mockup conversion)
```

## Available Scripts

### Development
- `npm run dev` - Start Vite development server
- `npm run build` - Build the mockup project
- `npm run preview` - Preview built project

### Theme Building
- `npm run build-css` - Generate theme CSS using Tailwind
- `npm run build-mock` - Run mockup conversion script + build CSS
- `npm run mock` - Complete mockup build process
- `npm run deploy-mock` - Build mockups and upload to HubSpot

### Utilities
- `npm run lint` - Run ESLint
- `npm run upload:hubl` - Upload theme to HubSpot

## How It Works

1. **Mockup Development**: Build your theme mockups using React + Tailwind in this directory
2. **CSS Generation**: `build-css` compiles Tailwind to generate theme-specific CSS files
3. **Template Conversion**: `run-mock.js` converts HTML mockups to HubSpot HubL templates
4. **HubSpot Integration**: Converted templates are placed in `../src/sone-theme/templates/`
5. **Deployment**: Upload the complete theme to HubSpot for testing

## Migration Notes

This structure represents a migration from the old project architecture where:
- Old: `sone-project/sone-app` contained the React app
- New: `mockup/` contains the development environment
- Templates now go directly to `src/sone-theme/templates/`
- CSS compilation uses Tailwind instead of Sass

## Getting Started

### First Time Setup
1. Install dependencies: `npm install`

### Development Workflow

#### Step 1: Build Mockups and CSS
```bash
npm run build-mock
```
This command:
- Processes HTML files from `templates/pages/` 
- Converts them to HubSpot HubL templates in `../src/sone-theme/templates/`
- Compiles Tailwind CSS to `assets/css/lexjet-theme.css`

#### Step 2: Develop Locally (Optional)
```bash
npm run dev
```
- Start Vite development server for mockup development

#### Step 3: Deploy to HubSpot
```bash
npm run deploy-mock
```
- Runs the complete build process
- Uploads the theme to HubSpot for testing

### Individual Commands
- `npm run build-css` - Only compile CSS (Tailwind → CSS)
- `npm run mock` - Only run the build process (same as build-mock)
- `npm run upload:hubl` - Only upload to HubSpot (no build)